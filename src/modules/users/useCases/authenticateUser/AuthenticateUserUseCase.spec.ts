
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import {AuthenticateUserUseCase} from "../../useCases/authenticateUser/AuthenticateUserUseCase";
import {ICreateUserDTO} from "../../useCases/createUser/ICreateUserDTO";
import {CreateUserUseCase} from "../../useCases/createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";



let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe ("Authenticate user",()=>{

    beforeEach(()=>{ 
        inMemoryUsersRepository = new InMemoryUsersRepository(); 
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    
    });

    it("Should not be able to authenticate a non-existing user", async () => {
        await expect(authenticateUserUseCase.execute({
          email: "user Email",
          password: "User passWord test",
        })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
      });

    it("should be able to authenticate user",async()=>{

        const user: ICreateUserDTO ={
            name:"wesley",
            email: "wesley@gmail.com",
            password:"1234"

        };

        console.log(user);

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email:user.email, 
            password: user.password
        });

        console.log(result);

        expect(result).toHaveProperty("token");
        expect(result.user).toHaveProperty("id");
    });

    it("Should not be able to authenticate a user with an invalid password", async () => {
        const user = {
          name: "User Test",
          email: "User Email",
          password: "User password",
        };
    
        await createUserUseCase.execute(user);
    
        await expect(authenticateUserUseCase.execute({
          email: user.email,
          password: '321',
        })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
      });
});