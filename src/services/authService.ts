import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const register = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string
) => {
  if (!email.endsWith("@myges.fr"))
    throw new Error("L'email doit être un email GES");
  const user = await User.findOne({ email });
  if (user) throw new Error("Utilisateur déjà existant");
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstname,
    lastname,
    email,
    role: "user",
    password: hashedPassword,
  });

  const userCreated = await newUser.save();

  const token = jwt.sign(
    { id: userCreated._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return { token, user: userCreated };
};

const login = async (email: string, password: string) => {
  const findUser = await User.findOne({ email });
  if (!findUser) throw new Error("Utilisateur non trouvé");

  const isMatch = await bcrypt.compare(password, findUser.password);
  if (!isMatch) throw new Error("Identifiants invalides");

  if (!findUser.isEmailVerified) throw new Error("Email non vérifié");

  const token = jwt.sign(
    { id: findUser._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
  return { token, user: findUser };
};

const sendVerificationCode = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur non trouvé");

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  user.verificationCode = verificationCode;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lockerz.code.sender@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "example@myges.com",
    to: email,
    subject: "Code de vérification",
    text: `Votre code de vérification est : ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);

  return { message: "Code envoyé" };
};

const verifyCode = async (email: string, code: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur non trouvé");

  if (user.verificationCode === code) {
    user.isEmailVerified = true;
    user.verificationCode = "";
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const { password, verificationCode, ...userWithoutSensitiveData } =
      user.toObject();

    return { token, user: userWithoutSensitiveData };
  } else {
    throw new Error("Code incorrect");
  }
};

export { register, login, sendVerificationCode, verifyCode };
