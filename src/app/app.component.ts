import { Component , OnInit} from '@angular/core';
import { UserService } from './service/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers : [UserService]
})

export class AppComponent  implements OnInit {
  public title = 'MusicPower';
  public user: User;
  public identity = false;
  public token;

  constructor(private _userService: UserService){
    //darle valor a una propiedad de una clase
    this.user = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
  
    
  }

  public onSubmit(){
    console.log(this.user);
  }
     
  
}
