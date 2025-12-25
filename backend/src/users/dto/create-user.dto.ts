export class CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  // Chúng ta chưa cần avatar hay role lúc này, để mặc định
}
