import bcrypt from "bcrypt";
class Password {
  static toHash(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("B4c0//", salt);
    return hash;
  }
  static compare(storedPassword: string, suppliedPassword: string) {
    const res = bcrypt.compareSync(suppliedPassword, storedPassword); // true
    return res;
  }
}
export default Password;
