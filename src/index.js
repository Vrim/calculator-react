import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Back from './60577.svg';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
    };

    onClick(id) {
        if (id == 'back-btn') {

        };
    };

    render() {
        return (
            <div id="NavBar">
                <ul>
                    <li><a href="https://github.com/Vrim/calculator-react"><img src={Back} alt="Back"/></a></li>
                </ul>
            </div>
        );
    };
}

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ' '
        };
        this.buttons = [
            new Button({id: 'C'}, this),
            new Button({id: '0' }, this),
            new Button({id: '1' }, this),
            new Button({id: '2' }, this),
            new Button({id: '3' }, this),
            new Button({id: '4' }, this),
            new Button({id: '5' }, this),
            new Button({id: '6' }, this),
            new Button({id: '7' }, this),
            new Button({id: '8' }, this),
            new Button({id: '9' }, this),
            new Button({id: '+' }, this),
            new Button({id: '-' }, this),
            new Button({id: '/' }, this),
            new Button({id: '*' }, this),
            new Button({id: '^' }, this),
            new Button({id: '%' }, this),
            new Button({id: '=' }, this),
            new Button({id: '.' }, this),
            new Button({id: '(' }, this),
            new Button({id: ')' }, this)
        ];
    };

    render() {
        return (
            <div id="calculator">
                <div className="display">
                    {this.state.value}
                </div>
                <div className="btns">
                    {this.buttons.map(btn => btn.render())}
                </div>
            </div>
        );
    };
    
    onClick(operation) {
        var new_val;
        if (operation == 'C') {
            new_val = ' ';
        } else if (operation == "=") {
            new_val = new Equation(this.state.value.toString()).evaluate().toString();
        } else {
            new_val = this.state.value += operation.toString()
            this.setState({value: new_val});
        };
        this.setState({value: new_val});
    };

    evaluate(eq) {
        return new Equation(eq).evaluate()
    };
}

class Equation {
    constructor(content) {
        this.content = content.replace(" ", "");
    };

    evaluate() {
        var value;
        var equations;
        if (!isNaN(this.content)) {
            return parseInt(this.content);
        } else if (this.content == '') {
            return ' ';
        } else if (this.content.includes('(')) {
            if (!this.content.includes(')')) {
                throw UnevenBracketError;
            };
            return this.eval_brackets().evaluate();
        } else if (this.content.includes(')')) {
            if (!this.content.includes('(')) {
                throw UnevenBracketError;
            };
            return this.eval_brackets().evaluate();
        } else if (this.content.includes('^')) {
            equations = this.split("^");
            value = equations[0].evaluate();
            for (var i = 1; i < equations.length; i++) {
                value **= equations[i].evaluate();
            }
        } else if (this.content.includes('+')) {
            equations = this.split("+");
            value = equations[0].evaluate();
            for (var i = 1; i < equations.length; i++) {
                value += equations[i].evaluate()
            }
        } else if (this.content.includes('-')) {
            equations = this.split("-");
            value = equations[0].evaluate();
            for (var i = 1; i < equations.length; i++) {
                value -= equations[i].evaluate()
            }
        } else if (this.content.includes('*')) {
            equations = this.split("*");
            value = equations[0].evaluate();
            for (var i = 1; i < equations.length; i++) {
                value *= equations[i].evaluate()
            }
        } else if (this.content.includes('/')) {
            equations = this.split("/");
            value = equations[0].evaluate();
            for (var i = 1; i < equations.length; i++) {
                value /= equations[i].evaluate()
            }
        } else if (this.content.includes('%')) {
            equations = this.split("%");
            value = equations[0].evaluate();
            for (var i = 1; i < equations.length; i++) {
                value %= equations[i].evaluate()
            }
        };
        return value;
    };

    eval_brackets() {
        var c = this.content;
        var openbr = 1;
        var closebr = 0;
        var index_of_end = -1;
        var start = c.indexOf('(');
        for (var i = start + 1; i < c.length; i++) {
            if (c[i] == ')') {
                closebr += 1;
            } else if (c[i] == '(') {
                openbr += 1;
            };
            if (openbr == closebr) {
                index_of_end = i;
                break;
            };
        };
        var left_side = c.slice(0, start);
        var right_side = c.slice(index_of_end + 1);

        // Check if there is an operator beside the bracket, else, multiply
        if (left_side.length > 0) {
            var end_l = left_side[-1];
            if (!"*/+-^%([".includes(end_l)) {
                left_side += '*';
            };
        };
        if (right_side.length > 0) {
            var start_r = right_side[0];
            if (!"*/+-^%([".includes(start_r)) {
                right_side = '*' + right_side;
            };
        };

        var new_c = left_side + (new Equation(c.slice(start + 1, index_of_end))).evaluate() + right_side;
        return new Equation(new_c);
    };
    
    split(delim) {
        var c = this.content.split(delim);
        var eq = [];
        for (var i = 0; i < c.length; i++) {
            eq.push(new Equation(c[i]));
        };
        return eq;
    };
}

class UnevenBracketError extends Error {
    constructor() {
        super("Missing a bracket");
        this.name = "UnevenBracketError";
    }
}

class Button extends React.Component {
    constructor(props, parent) {
        super(props);
        this.parent = parent;
    };

    render() {
        return (
            <button className="btn" id={this.props.id} onClick={this.handleClick}>
                {this.props.id}
            </button>
        );
    };
    handleClick = e => {
        this.parent.onClick(e.target.id);
        this.setState();
    };
}

// ======== Render =========
ReactDOM.render(
    <div><NavBar />
    <Calculator /></div>,
    document.getElementById('root')
);
