
import {Post} from './post.entity'


export class User {
  id: number ;
email: string ;
password: string  | null;
tokenVersion: number ;
posts?: Post[] ;
}
