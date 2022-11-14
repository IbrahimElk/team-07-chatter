//Author: Guust Luyckx
//Date: 2022/10/31

import fs from 'fs';
import type { Channel } from '../channel/channel.js';
import { FriendChannel } from '../channel/friendchannel.js';
import { User } from '../user/user.js';

function channelSave(channel: Channel |  Channel[]) {
    if (channel instanceof Array)  {
        for (const x of channel) {
            const obj = JSON.stringify(x, ['NAME', 'messages', 'users', 'DATECREATED']);
            let id = x.getName().toString();
            let path = './assets/database/channels/' + id + '.json';
            fs.writeFile(path, obj, err => {
                if (err) {
                throw err
                }
                console.log('channel data is saved.')
            })
        }
    }
    else {
        const obj = JSON.stringify(channel);
        let id = channel.getName().toString();
        let path = './assets/database/channels/' + id + '.json';
        fs.writeFile(path, obj, err => {
            if (err) {
              throw err
            }
            console.log('channel data is saved.')
        })
    }
}

channelSave(new FriendChannel('Channel1', new User('Guust Luyckx', 'hallo')));

function channelsLoad() {
    const directory = fs.opendirSync('./assets/database/channels');
    let file;
    while ((file = directory.readSync()) !== null) {
        fs.readFile(file.name, 'utf-8', (err, data) => {
            if (err) {
                throw err
            }
            console.log('JSON data is saved.')
            const parsedobj = JSON.parse(data.toString());
            //add channel to server list
        })
    }
    directory.closeSync();
}


function userSave(user: User) {
    const obj = JSON.stringify(user);
    let name = user.name.tostring();
    let path = './assets/database/users/' + name + '.json';
    fs.writeFile(path, obj, err => {
        if (err) {
            throw err
        }
        console.log('JSON data is saved.')
    })
}

function userLoad(username: string) {
    let path = './assets/database/users/' + username + '.json';
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            throw err
        }
        console.log('JSON data is saved.')
        const parsedobj = JSON.parse(data.toString());
            //add user to server list
    })
}

function usersLoad() {
    const directory = fs.opendirSync('./assets/database/users');
    let file;
    while ((file = directory.readSync()) !== null) {
        fs.readFile(file.name, 'utf-8', (err, data) => {
            if (err) {
                throw err
            }
            console.log('JSON data is saved.')
            const parsedobj = JSON.parse(data.toString());
            //add user to server list
        })
    }
    directory.closeSync();
}