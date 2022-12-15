# CHATTER

## Description

A basic terminal-based chat application consisting of a central server and several chat clients.
Users can add friends and send and receive messages to and from them.
Keystroke analysis of messages (based on timings of n-grams) is used to compare those with those of previously recorded messages to hopefully detect an possible impostor.

## Table of contents

- [CHATTER](#chatter)
  - [Description](#description)
  - [Table of contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
    - [starting](#starting)
    - [functions](#functions)
  - [Credits](#credits)
  - [Licence](#licence)
  - [Privacy policy](#privacy-policy)

## Getting started

### Prerequisites

- npm
  ```
  npm install
  ```

### Installation

1. Clone the repository
   ```
   git clone https://gitlab.kuleuven.be/p-en-o-cw/2022-2023/team-07-chatter.git
   ```

## Usage

### starting

To start the server, enter `npm run Server`, followed by `.start` in a terminal.

To start a client, enter `npm run Client` in another terminal and follow the instruction in the terminal.

First, you will be asked if you want to connect to a remote server. If you choose not to connect, you can immediately log in ot register, more information about this can be found in the section below.
If you choose to connect to a remote server, you have to open a new terminal and enter `npx localtunnel --port 8080`. Then you have to enter the url you receive is this terminal, in the client terminal. Afterwards, you can continue to log in or register, more information about this can be found in the section below.

### functions

When you started the client, your first question will be if you want to register, log in, or exit.

![login-register in terminal](/figures/login_register.png 'in terminal')

If you already have an account on this chatter, you can type 'l' to log in, otherwise, you will have to type 'r' to register.
If you chose to register, you will have to choose a username and password. Beware that there are some restrictions:
The length of the username has to be more than one and the password needs to have at least one uppercase letter, one lowercase letter, a punctuation mark, and at least 8 characters.
If you want to exit the chatter instead, you can type 'e'.

When you are registered or logged in, you can choose out of multiple actions, listed in a table like in the image below.

![actions interface in terminal](/figures/interface.png 'in terminal')

The first function, with index 0, is called 'list of friends'. If you choose this function, a list of your friends will be shown.
If you want to chat with one of your friends, you will have to choose the second function (the index is 1) called 'select your friend'.
This function will show you all the previous texts you have sent to this friend and allow you to send a new message.
If you want to add a new friend, you will have to choose the third function (the index is 2) called 'add friend'.
After you entered the username of your friend-to-be, he or she will appear in your list of friends and vice versa.
In this process, there will not be asked for permission before befriending someone on the chatter, but if you do not want to be friends with someone,
you can use the fourth function (the index is 3) called 'remove friend' to remove a friend from your list.
You will have to enter the name of the friend you want to unfriend, and each of you will be removed from each others list of friends.
The fifth and last function (the index is 4) serves to exit the chatter. If you key in 4 followed by enter, you will exit this chatter.

## Credits

This chatter is created by:

- Amélie Van Loock
- Barteld Van Nieuwenhove
- Guust Luyckx
- Ibrahim El Kaddouri
- John Gao
- Maité Desmedt
- Thomas Evenepoel
- Vincent Ferrante

## Licence

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Privacy policy

By using the chatter, you agree to the collection and use of information about your keystroke dynamics.
More information in [this link](https://www.privacypolicies.com/live/8ccc2e80-5bb8-4b90-a16c-f4a185705867).
