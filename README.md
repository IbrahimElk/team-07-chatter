# CHATTER

## Description

A basic terminal-based chat application consisting of a central server and several chat clients.
Users can add friends and send and receive messages to and from them.
Keystroke analysis of messages (based on timings of n-grams) is used to compare those with those of previously recorded messages to hopefully detect any possible impostor.

## Table of contents

- [CHATTER](#chatter)
  - [Description](#description)
  - [Table of contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
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

To start the server, enter `npm run Server`, followed by `.start` in a terminal.

To start a client, enter `npm run Client` in another terminal and follow the instruction in the terminal.

To register, you need a username, which length has to be more than zero, and a password with some restrictions. The password needs to have at least one uppercase letter, one lowercase letter, a punctuation mark and at least 8 characters.

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
