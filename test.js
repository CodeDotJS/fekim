import childProcess from 'child_process';
import test from 'ava';

test.cb(t => {
	const cp = childProcess.spawn('./cli.js', ['-l', '100?text=node'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});

test.cb('download', t => {
	const cp = childProcess.spawn('./cli.js', ['-d', '100?text=node'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});
