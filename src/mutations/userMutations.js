import { gql } from "@apollo/client";

// const CREATE_USER = gql`
//   mutation createUser($name: String!, $email: String!, $password: String!) {
//     createUser(name: $name, email: $email, password: $password) {
//       name
//       email
//       balance
//     }
//   }
// `;

const CREATE_USER = gql`
  mutation createUser($user: UserInfo!) {
    createUser(user: $user) {
      id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $userData: UserData!) {
    updateUser(id: $id, userData: $userData) {
      balance
      transactions {
        info
        timeStamp
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const LOG_IN_USER = gql`
  mutation loginUser($email: String!, $password: String) {
    loginUser(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export { CREATE_USER, UPDATE_USER, DELETE_USER, LOG_IN_USER };
