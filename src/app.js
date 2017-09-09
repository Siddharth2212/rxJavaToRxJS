import $ from 'jquery';
import Rx from 'rxjs/Rx';

const btn = $('#btn');
const input = $('#input');
const output = $('#output');

//Mocking setUser request with a promise and setTimeOut
function setUser(username) {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve({
                'updated': 'true'
            })
        }, 3000);
    });
}

//Observable capturing submit events
const submitStream$ = Rx.Observable.fromEvent(btn, 'click')
    .map(e => {
        e.value = input.val();
        return e;
    })
    .switchMap(event => {
        output.html('Loading...');
        btn.attr('disabled', 'true');
        return Rx.Observable.fromPromise(setUser(event.value));
    })
    .map(response => response.updated)
    .onErrorResumeNext(err => output.html(JSON.stringify(err)));

submitStream$.subscribe(
    function (result) {
        btn.removeAttr("disabled");
        if(result == 'true'){
         output.html('Successfully set name');
        }
        else if(result == 'false'){
            output.html('Failed to set name');
        }
    },
    function (err) {
        console.log(err);
    },
    function () {
        console.log('Completed');
    }
)

//Mocking verify input network request with a promise and setTimeOut
function checkInput(inputValue) {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve({
                'isValid': 'true'
            })
        }, 3000);
    });
}

//Observable capturing input keyup events
const inputStream$ = Rx.Observable.fromEvent(input, 'keyup')
    .map(e => {
        return e.target.value;
    })
    .switchMap(eventValue => {
        output.html('Verifying input...');
        return Rx.Observable.fromPromise(checkInput(eventValue));
    })
    .map(response => response.isValid)
    .onErrorResumeNext(err => output.html(JSON.stringify(err)));

inputStream$.subscribe(
    function (result) {
        if(result == 'true'){
            btn.removeAttr("disabled");
            output.html('Valid input. You may submit it.');
        }
        else if(result == 'false'){
            output.html('Invalid input');
        }
    },
    function (err) {
        console.log(err);
    },
    function () {
        console.log('Completed');
    }
)
