
import { User, UserProps } from './models/User';
import { Collection} from './models/Collection';
import { UserForm } from './views/UserForm';
import { UserEdit } from './views/UserEdit';
import { UserList } from './views/UserList';

const users = new Collection('http://localhost:3000/users', 
  (json: UserProps) => {
    return User.build(json)
  });


users.on('change', () => {
  const root = document.getElementById('root');

  if (root) {
    new UserList(root, users).render();
  }
});

users.fetch();


/*
const user = User.build({ name: 'Test', age: 10 });

const root = document.getElementById('root');

if (root) {
  const userEdit = new UserEdit(root, user);
  userEdit.render();

  console.log(userEdit);
}
*/