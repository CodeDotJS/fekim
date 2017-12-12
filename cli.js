#!/usr/bin/env node

'use strict';

const dns = require('dns');
const fs = require('fs');
const got = require('got');
const http = require('follow-redirects').http;
const logUpdate = require('log-update');
const ora = require('ora');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const arg = process.argv[2];
const inf = process.argv[3];

if (!arg || arg === '-h' || arg === '--help') {
	logUpdate(`
 Usage: fekim <command> <values>

 Values -

 › 300                  › 350x200/ff0000/000
 › 250x100              › 350x200/ff0000,128/000,255
 › 250x100/ff0000       › 350x200/?text=Hello

 Commands:
  -l, --link        Get link to the option that you passed
  -d, --download    Download specific image

 Help:
  $ fekim -l 300x250/fff
  $ fekim -l 100x100/?text=Hello
  $ fekim -d 5x5
  `);
	process.exit(1);
}

const url = `http://fakeimg.pl/${inf}`;

const spinner = ora();

if (arg === '-l' || arg === '--link') {
	logUpdate(`\n› ${url} \n`);
}

if (arg === '-d' || arg === '--download') {
	dns.lookup('fakeimg.pl', err => {
		if (err) {
			logUpdate(`\n› Can't download. You're offline! \n`);
			process.exit(1);
		} else {
			logUpdate();
			spinner.text = 'Hold on...';
			spinner.start();
			got(url).then(() => {
				const img = Math.random().toString(15).substr(3, 7);
				const save = fs.createWriteStream(`${img}.png`);
				spinner.text = 'Downloading...';
				http.get(url, (res, cb) => {
					res.pipe(save);
					save.on('finish', () => {
						save.close(cb);
						logUpdate(`\n› Saved as ${img}.png \n`);
						spinner.stop();
					});
				});
			}).catch(err => {
				if (err) {
					logUpdate(`\n› Couldn't find such image. Recheck the format! \n`);
					process.exit(1);
				}
			});
		}
	});
}
