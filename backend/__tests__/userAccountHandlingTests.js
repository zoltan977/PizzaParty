const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const { startServer, stopServer, deleteAll } = require("./util/inMemDb");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");
const createToken = require("../utils/createToken");
const MockAdapter = require("axios-mock-adapter");
const axios = require("axios");
const jwt = require("jsonwebtoken");

describe("Account handling tests", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await startServer("userAccountTestDatabase");
  });

  afterAll(async () => {
    await stopServer(mongoServer);
  });

  afterEach(async () => {
    await deleteAll([User]);
  });

  test("/api/google POST should create a user when a code is posted to it", async () => {
    //given axios POSTs to https://oauth2.googleapis.com/token are mocked out
    const mock = new MockAdapter(axios);

    //and a JWT encoded json is returned with this user data when a POST is sent
    const googleToken = jwt.sign(
      {
        email: "test@email.hu",
        email_verified: true,
        name: "zoli",
        picture: "image",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      }
    );

    mock.onPost("https://oauth2.googleapis.com/token").reply(200, {
      id_token: googleToken,
    });

    //when we send a POST request to the /api/google endpoint with a dummy code in the body
    const resp = await request
      .post("/api/google")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ code: "alma" });

    //then a user is created in the database with the data returned by the mocked POST to google
    const user = await User.findOne();
    expect(resp.status).toBe(200);
    expect(resp.body.token).toBeTruthy();
    expect(user).toBeTruthy();
    expect(user.email).toBe("test@email.hu");
  });

  test("/api/google POST should give back an error message when the user email is not verified at google", async () => {
    //given axios POSTs to https://oauth2.googleapis.com/token are mocked out
    const mock = new MockAdapter(axios);

    //and a JWT encoded json is returned with this user data when a POST is sent
    const googleToken = jwt.sign(
      {
        email: "test@email.hu",
        email_verified: false,
        name: "zoli",
        picture: "image",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      }
    );

    mock.onPost("https://oauth2.googleapis.com/token").reply(200, {
      id_token: googleToken,
    });

    //when we send a POST request to the /api/google endpoint with a dummy code in the body
    const resp = await request
      .post("/api/google")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ code: "alma" });

    const user = await User.findOne();
    //then an error message should come back with a 401 status
    expect(resp.status).toBe(401);
    expect(resp.body.msg).toBe("Email not verified!");
    expect(user).toBeFalsy();
  });

  test("/api/google POST sends back an error message when there is no code in the POST request", async () => {
    //when we send a POST request to the /api/google endpoint without a code in the body
    const resp = await request
      .post("/api/google")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send();

    //then an error message is sent with 400 status
    expect(resp.status).toBe(400);
    expect(resp.body.errors).toBeTruthy();
    expect(resp.body.errors.length).toBe(1);
    expect(resp.body.errors[0].msg).toBe("Hiányzik a kód");
  });

  test("/api/login POST should return an access token when correct credentials are given and an error message when credentials are invalid", async () => {
    //given a user with email and password in the database
    const password = "jelszo";
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: "Név",
      email: "email@email.hu",
      password: encodedPassword,
    });
    await newUser.save();

    //when we POST correct credentials
    const res = await request
      .post("/api/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email@email.hu", password: "jelszo" });

    //then we should be given an access token
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();

    //given the same user in the database

    //when we try to login with a different email
    const res2 = await request
      .post("/api/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "em@il.hu", password: "jelszo" });

    //then an error message is sent with 400 status code
    expect(res2.status).toBe(400);
    expect(res2.body.msg).toBe("Hibás email vagy jelszó");
  });

  test("/api/login POST should give back an error message when the user has not been confirmed yet", async () => {
    //given a user with email and password and a confirmation property in the database
    const password = "jelszo";
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);
    //and the confirmation date is not older than 5 minutes
    const newUser = new User({
      name: "Név",
      email: "email@email.hu",
      password: encodedPassword,
      confirmation: {
        code: "123456",
        date: new Date(new Date().getTime() - 3 * 60 * 1000),
      },
    });
    const savedUser = await newUser.save();

    //when we POST correct credentials
    const res = await request
      .post("/api/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email@email.hu", password: "jelszo" });

    //then we should be given an error message
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(
      "Meg kell erősítened az emailben kapott linken a regisztrációt!"
    );

    //given the confirmation date is older than 5 minutes
    savedUser.confirmation.date = new Date(
      new Date().getTime() - 6 * 60 * 1000
    );
    savedUser.save();

    //when we POST correct credentials
    const res2 = await request
      .post("/api/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email@email.hu", password: "jelszo" });

    const user = await User.findOne();
    //then the user should be deleted
    expect(res2.status).toBe(400);
    expect(res2.body.msg).toBe("Újra regisztrálnod kell!");
    expect(user).toBeFalsy();
  });

  test("/api/login POST gives back a message when there is a user who matches with the POSTed credentials but no password belongs to the user", async () => {
    //given a user with email but no password in the database
    const newUser = new User({
      name: "Név",
      email: "email@email.hu",
    });
    await newUser.save();

    //when we POST correct credentials
    const res = await request
      .post("/api/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email@email.hu", password: "jelszo" });

    //then we should be given an error message
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(
      "Nincs jelszó. Valószínű google-al regisztráltál. Elfelejtett jelszó linken tudsz kérni jelszót ehhez az email címhez is"
    );
  });

  test("/api/login POST gives back error message(s) when the POST-ed data is invalid", async () => {
    //when we POST login data without password
    const res = await request
      .post("/api/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email@email.hu" });

    //then we should be given an error message with 400 status
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors.length).toBe(1);
    expect(res.body.errors[0].msg).toBe("Meg kell adni a jelszót!");

    //when we POST login data without password and email
    const res2 = await request
      .post("/api/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({});

    //then we should be given an error message with 400 status
    expect(res2.status).toBe(400);
    expect(res2.body.errors).toBeTruthy();
    expect(res2.body.errors.length).toBe(2);
    expect(res2.body.errors[0].msg).toBe("Valós email-t adj meg!");
    expect(res2.body.errors[1].msg).toBe("Meg kell adni a jelszót!");
  });

  test("/api/register POST should return 200 when user registration with given data is successful", async () => {
    //given NO User in the database

    //when we send the data of the new user
    const res = await request
      .post("/api/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ name: "Nevem", email: "email@email.hu", password: "jelszo" });

    //then the new user with the given data should exist in the database
    const count = await User.countDocuments();
    const user = await User.findOne();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(count).toBe(1);
    expect(user.name).toBe("Nevem");

    //given User with an email: email@email.hu in the database

    //when we send a registration request with the same email
    const res2 = await request
      .post("/api/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ name: "Nevem", email: "email@email.hu", password: "jelszo" });

    //then we get an error message with status 400
    const count2 = await User.countDocuments();
    const user2 = await User.findOne();

    expect(res2.status).toBe(400);
    expect(res2.body.msg).toBe(
      "Ezzel az email címmel már létezik felhasználó!"
    );
    expect(count2).toBe(1);
    expect(user2.name).toBe("Nevem");
  });

  test("/api/register POST gives back an error message when invalid data was POSTed", async () => {
    //given NO User in the database

    //when we send data of the new user without name property
    const res = await request
      .post("/api/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email@email.hu", password: "jelszo" });

    //then we should get back an error message with 400 status
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors.length).toBe(1);
    expect(res.body.errors[0].msg).toBe("Meg kell adni egy nevet!");

    //when we send data of the new user without name property and with invalid email
    const res2 = await request
      .post("/api/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email", password: "jelszo" });

    //then we should get back an error message with 400 status
    expect(res2.status).toBe(400);
    expect(res2.body.errors).toBeTruthy();
    expect(res2.body.errors.length).toBe(2);
    expect(res2.body.errors[0].msg).toBe("Meg kell adni egy nevet!");
    expect(res2.body.errors[1].msg).toBe("Valós email-t adj meg!");

    //when we send data of the new user without name property and with invalid email and with a password shorter than 6 characters
    const res3 = await request
      .post("/api/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email", password: "szo" });

    //then we should get back an error message with 400 status
    expect(res3.status).toBe(400);
    expect(res3.body.errors).toBeTruthy();
    expect(res3.body.errors.length).toBe(3);
    expect(res3.body.errors[0].msg).toBe("Meg kell adni egy nevet!");
    expect(res3.body.errors[1].msg).toBe("Valós email-t adj meg!");
    expect(res3.body.errors[2].msg).toBe(
      "Legalább 6 karakter hosszú jelszó kell!"
    );
  });

  test("/api/reset POST should create a reset property for the user belongs to the given email", async () => {
    //given a user with an email in the database
    const newUser = new User({
      name: "Név",
      email: "email@email.hu",
    });
    await newUser.save();

    //when we send to the reset endpoint the email address of the user in the database
    const res = await request
      .post("/api/reset")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email@email.hu" });

    //then a reset property should exist on the user
    const user = await User.findOne();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(user.reset).toBeTruthy();
  });

  test("/api/reset POST should give back an error message when there is no user to the given email", async () => {
    //given NO user in the database

    //when we send an email address to the reset endpoint
    const res = await request
      .post("/api/reset")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email@email.hu" });

    //then we should be given an error message with 401 status
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Ezzel az email címmel nincs felhasználó!");
  });

  test("/api/reset POST should give back an error message when invalid data is sent", async () => {
    //given NO user in the database

    //when we send an invalid email address to the reset endpoint
    const res = await request
      .post("/api/reset")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email" });

    //then we should be given an error message with 400 status
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors.length).toBe(1);
    expect(res.body.errors[0].msg).toBe("Valós email címet adj meg!");
  });

  test("/api/password POST endpoint should change the password of the user belongs to the given email address when the reset date of the user is not older than 5 minutes", async () => {
    //given a user with email and password and a generated reset property in the database
    const password = "jelszo";
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);

    const buf = randomBytes(256);
    const code = buf.toString("hex");

    //and the reset date is NO older than 5 minutes
    const reset = {
      code,
      date: new Date(),
    };

    const email = "email@email.hu";
    const newUser = new User({
      name: "Név",
      email,
      password: encodedPassword,
      reset,
    });
    await newUser.save();

    //when we send the new password with the code that was saved in the reset property and the email address of the user
    const res = await request
      .post(`/api/password`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ password: "123456", email, code });

    //then the user password should be updated in the database and the reset property should be deleted
    expect(res.status).toBe(200);
    const user = await User.findOne();
    const isMatch = await bcrypt.compare("123456", user.password);
    expect(isMatch).toBe(true);
    expect(user.reset).toBeFalsy();
  });

  test("/api/password POST endpoint should give back an error message when the reset date of the user is older than 5 minutes", async () => {
    //given a user with email and password and a generated reset property in the database
    const password = "jelszo";
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);

    const buf = randomBytes(256);
    const code = buf.toString("hex");

    //and the reset date is older than 5 minutes
    const reset = {
      code,
      date: new Date().getTime() - 6 * 60 * 1000,
    };

    const email = "email@email.hu";
    const newUser = new User({
      name: "Név",
      email,
      password: encodedPassword,
      reset,
    });
    await newUser.save();

    //when we send the new password with the code that was saved in the reset property and the email address of the user
    const res = await request
      .post(`/api/password`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ password: "123456", email, code });

    //then we should get back an error message and the reset property of the user should be deleted
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(
      "Több min öt perce telt el a jelszóváltoztatási kérés óta!"
    );
    const user = await User.findOne();
    expect(user.reset).toBeFalsy();
  });

  test("/api/password POST should give back an error message when no user in the database matches with the given email", async () => {
    //given no user in the database

    //when we POST a new password
    const res = await request
      .post(`/api/password`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ password: "123456", email: "em@il.hu", code: "123456" });

    //then we should get back an error message with 401 status
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Nincs felhasználó ezzel az email-el!");
  });

  test("/api/password POST should give back an error message if the user whose email was sent has no reset property", async () => {
    //given a user with email and password but no reset property
    const password = "jelszo";
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);

    const email = "email@email.hu";
    const newUser = new User({
      name: "Név",
      email,
      password: encodedPassword,
    });
    await newUser.save();

    //when we send the new password with a code and the email address of the user
    const res = await request
      .post(`/api/password`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ password: "123456", email, code: "123456" });

    //then we should get back an error with 401 status
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe(
      "Ezzel az email címmel nem kértek jelszóváltoztatást!"
    );
  });

  test("/api/password POST should give back an error message if the generated code does not match with the posted code", async () => {
    //given a user with email and password and a generated reset property in the database
    const password = "jelszo";
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);

    const code = "code";

    const reset = {
      code,
      date: new Date(),
    };

    const email = "email@email.hu";
    const newUser = new User({
      name: "Név",
      email,
      password: encodedPassword,
      reset,
    });
    await newUser.save();

    //when we send the new password with a code that is different from the one in the reset property and the email address of the user
    const res = await request
      .post(`/api/password`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ password: "jelszo", email, code: "123456" });

    //then we should get back an error message with 400 status
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("A gernerált kódok nem egyeznek!");
  });

  test("/api/password POST should give back an error response when the posted data is not valid", async () => {
    //when we POST a password without a generated code
    const res = await request
      .post(`/api/password`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ password: "jelszo", email: "em@il.hu" });

    //then we should get back an error message with 400 status
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors.length).toBe(1);
    expect(res.body.errors[0].msg).toBe("Hiányzik a generált kód");

    //when we POST a password without a generated code and an email
    const res2 = await request
      .post(`/api/password`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ password: "jelszo" });

    //then we should get back an error message with 400 status
    expect(res2.status).toBe(400);
    expect(res2.body.errors).toBeTruthy();
    expect(res2.body.errors.length).toBe(2);
    expect(res2.body.errors[0].msg).toBe("Hiányzik a generált kód");
    expect(res2.body.errors[1].msg).toBe("Valós email címet adj meg!");

    //when we POST a password shorter than 6 characters without a generated code and an email
    const res3 = await request
      .post(`/api/password`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ password: "szo" });

    //then we should get back an error message with 400 status
    expect(res3.status).toBe(400);
    expect(res3.body.errors).toBeTruthy();
    expect(res3.body.errors.length).toBe(3);
    expect(res3.body.errors[0].msg).toBe("Hiányzik a generált kód");
    expect(res3.body.errors[1].msg).toBe("Valós email címet adj meg!");
    expect(res3.body.errors[2].msg).toBe(
      "Legalább 6 karkterből álló jelszó kell!"
    );
  });

  test("/api/confirm POST endpoint should give back an access token of the user belongs to the given email address", async () => {
    //given a user with email and a generated confirm property in the database

    const buf = randomBytes(256);
    const code = buf.toString("hex");

    const confirmation = {
      code,
      date: new Date(),
    };

    const email = "email@email.hu";
    const newUser = new User({
      name: "Név",
      email,
      confirmation,
    });
    await newUser.save();

    //when we send the code that was saved in the confirm property of the user and the email address of the user
    const res = await request
      .post(`/api/confirm`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email, code });

    //then we are given an accesstoken and the confirmation property is deleted
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    const user = await User.findOne();
    expect(user.confirmation).toBeFalsy();
  });

  test("/api/confirm POST endpoint should give back an error message when the date in the confirm property of the user belongs to the given email address is older than 5 minutes", async () => {
    //given a user with email and a generated confirm property in the database
    const buf = randomBytes(256);
    const code = buf.toString("hex");
    //and the date in the confirm property is older than 6 minute
    const confirmation = {
      code,
      date: new Date(new Date().getTime() - 6 * 60 * 1000),
    };

    const email = "email@email.hu";
    const newUser = new User({
      name: "Név",
      email,
      confirmation,
    });
    await newUser.save();

    //when we send the code that was saved in the confirm property of the user and the email address of the user
    const res = await request
      .post(`/api/confirm`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email, code });

    //then we are given an error message with 400 status and the user should be deleted
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Több mint öt perc telt el a regisztráció óta!");
    const user = await User.findOne();
    expect(user).toBeFalsy();
  });

  test("/api/confirm POST endpoint should give back an error message when the POSTed code does not match with the code in the confirm property of the user belongs to the given email", async () => {
    //given a user with email and a confirm property in the database
    const confirmation = {
      code: "123456",
      date: new Date(),
    };

    const email = "email@email.hu";
    const newUser = new User({
      name: "Név",
      email,
      confirmation,
    });
    await newUser.save();

    //when we send a different code than the one which was saved in the confirm property of the user and the email address of the user
    const res = await request
      .post(`/api/confirm`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email, code: "code" });

    //then we are given an error message with 400 status and the user should be deleted
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Generált kódok nem egyeznek!");
    const user = await User.findOne();
    expect(user).toBeFalsy();
  });

  test("/api/confirm POST endpoint should give back an error message when the user belongs to the given email does not have a confirmation property", async () => {
    //given a user with email and without a generated confirm property in the database
    const email = "email@email.hu";
    const newUser = new User({
      name: "Név",
      email,
    });
    await newUser.save();

    //when we send a code and the email address of the user
    const res = await request
      .post(`/api/confirm`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email, code: "123456" });

    //then we are given an error message with 400 status
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe(
      "Ezzel az email címmel nincs megerősítésre váró felhasználó!"
    );
  });

  test("/api/confirm POST should give back an error message when there is no user in the database to the given email", async () => {
    //given no user in the database

    //when we send a code and an email address
    const res = await request
      .post(`/api/confirm`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "em@il.hu", code: "123456" });

    //then we are given an error message with 400 status
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Nincs felhasználó ezzel az email címmel!");
  });

  test("/api/confirm POST should give back an error message when the posted data is not valid", async () => {
    //given no user in the database

    //when we send a code and an invalid email address
    const res = await request
      .post(`/api/confirm`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email", code: "123456" });

    //then we are given an error message with 400 status
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors.length).toBe(1);
    expect(res.body.errors[0].msg).toBe("Valós email címet kell megadni!");

    //when we send an object with NO code and an invalid email address
    const res2 = await request
      .post(`/api/confirm`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ email: "email" });

    //then we are given an error message with 400 status
    expect(res2.status).toBe(400);
    expect(res2.body.errors).toBeTruthy();
    expect(res2.body.errors.length).toBe(2);
    expect(res2.body.errors[0].msg).toBe("Hiányzik az ellenőrző kód");
    expect(res2.body.errors[1].msg).toBe("Valós email címet kell megadni!");
  });

  test("/api/loaduser GET should give back the user data if the sent token is valid and belongs to an actual user", async () => {
    //given a user with email in the database
    const email = "email@email.hu";
    const newUser = new User({
      name: "my name",
      email,
    });
    await newUser.save();
    //and a generated token with the data of the user
    const token = createToken(newUser);

    //when we send a GET request with the generated token in the header
    const res = await request.get("/api/loaduser").set("x-auth-token", token);

    //then the data of the user should return
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("my name");

    //given the user has been deleted from the database
    await deleteAll([User]);

    //when we send a request with the same token in the header
    const res2 = await request.get("/api/loaduser").set("x-auth-token", token);

    //then we should get back a message says: Authentication error: This user has been deleted
    expect(res2.status).toBe(401);
    expect(res2.body.msg).toBe(
      "Authentication error: This user has been deleted"
    );
  });

  test("/api/loaduser GET should give back an error message when it is called without an access token", async () => {
    //when we send a GET request without an access token
    const res = await request.get("/api/loaduser");

    //then an error message should return with status 401
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe(
      "Authentication error: No token. Authorization denied"
    );
  });

  test("/api/loaduser GET should give back an error message when it is called with an invalid access token", async () => {
    //when we send a GET request with an invalid access token
    const res = await request
      .get("/api/loaduser")
      .set("x-auth-token", "xyz123");

    //then an error message should return with status 401
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Authentication error: Token is not valid");
  });

  test("/api/name_change POST should change the name of the authenticated user to the given name", async () => {
    //given a user with email and name in the database
    const email = "email@email.hu";
    const newUser = new User({
      name: "my name",
      email,
    });
    await newUser.save();
    //and a generated token with the data of the user
    const token = createToken(newUser);

    //when we POST a new name to the /api/name_change
    const res = await request
      .post(`/api/name_change`)
      .set("x-auth-token", token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ newName: "my new name" });

    //then the name of that user should change
    const user = await User.findOne();

    expect(res.status).toBe(200);
    expect(user.name).toBe("my new name");
  });

  test("/api/name_change POST should give back an error message when it is called without an access token", async () => {
    //when we send a POST request without an access token
    const res = await request
      .post("/api/name_change")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ newName: "my new name" });

    //then an error message should return with status 401
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe(
      "Authentication error: No token. Authorization denied"
    );
  });

  test("/api/name_change POST should give back an error message when it is called with an invalid access token", async () => {
    //when we send a POST request with an invalid access token
    const res = await request
      .post("/api/name_change")
      .set("x-auth-token", "xyz123")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ newName: "my new name" });

    //then an error message should return with status 401
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Authentication error: Token is not valid");
  });
});
