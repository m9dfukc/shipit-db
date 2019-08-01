'use strict';

/*
BSD 2-Clause License

Copyright (c) 2018, Tim Channell
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const readline = require('readline');


const options = {
    yes: [ 'yes', 'y' ],
    no:  [ 'no', 'n' ]
};


function defaultInvalidHandler ({ question, defaultValue, yesValues, noValues }) {
    process.stdout.write('\nInvalid Response.\n');
    process.stdout.write('Answer either yes : (' + yesValues.join(', ')+') \n');
    process.stdout.write('Or no: (' + noValues.join(', ') + ') \n\n');
}


async function ask ({ question, defaultValue, yesValues, noValues, invalid }) {
    if (!invalid || typeof invalid !== 'function')
        invalid = defaultInvalidHandler;

    yesValues = (yesValues || options.yes).map((v) => v.toLowerCase());
    noValues  = (noValues || options.no).map((v) => v.toLowerCase());

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(function (resolve, reject) {
        rl.question(question + ' ', async function (answer) {
            rl.close();

            const cleaned = answer.trim().toLowerCase();
            if (cleaned == '' && defaultValue != null)
                return resolve(defaultValue);

            if (yesValues.indexOf(cleaned) >= 0)
                return resolve(true);

            if (noValues.indexOf(cleaned) >= 0)
                return resolve(false);

            invalid({ question, defaultValue, yesValues, noValues });
            const result = await ask({ question, defaultValue, yesValues, noValues, invalid });
            resolve(result);
        });
    });
}


module.exports = ask;
