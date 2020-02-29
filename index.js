import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css"

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: '',
      answer: '',
      hasdot: false,
      naughtyzero: false,//是否为关键0
      newnumber: true,   //是否为新操作数
    };
    this.handleClear = this.handleClear.bind(this);
  }

  handleClear() {
    this.setState({
      formula: '',
      answer: '',
      hasdot: false,
      naughtyzero: false,
      newnumber: true,
    })
  }
  
  handleNumber(e) {
    if(this.state.answer !== '') {                                              //如果之前有计算结果，初始化
      this.setState({
        formula: e.target.value,
        answer: '',
        hasdot: false,
        naughtyzero: false,
        newnumber: false,
      })
    } else if (!this.state.naughtyzero || (this.state.naughtyzero && !this.state.newnumber)) {//如果之前没有关键0，或者有关键0但不是新操作数，正常写值
      this.setState({
        formula: this.state.formula + e.target.value,
        newnumber: false,
      });            
    } else if (this.state.naughtyzero && this.state.newnumber) {                //如果既有关键0还是新操作数，替换掉关键0并置位
      this.setState({
        formula: this.state.formula.replace(/0$/,e.target.value),
        naughtyzero: false,
        newnumber: false,
      })
    }
  }

  handleZero(e) {
    if(this.state.answer !== '') {                                              //如果之前有计算结果，初始化
      this.setState({
        formula: e.target.value,
        answer: '',
        hasdot: false,
        naughtyzero: true,
        newnumber: true,
      })
    } else if ((!this.state.naughtyzero && !this.state.newnumber) || (this.state.naughtyzero && !this.state.newnumber)) { 
      this.setState({
        formula: this.state.formula + e.target.value,                           //如果之前没有关键0，且不是新操作数，或者有关键0，但不是新操作数，写个0
      });
    } else if (!this.state.naughtyzero && this.state.newnumber) {               //如果没有关键0，但是是新操作数，写个0并相应置位
      this.setState({
        formula: this.state.formula + e.target.value,
        naughtyzero: true,
      })
    } else return;                                                              //最后一种情形是，既有关键0，又是新操作数，直接返回
  }

  handleDecimal(e) {
    if(this.state.formula === '' || this.state.hasdot || this.state.formula.search(/\W$/) === this.state.formula.length-1 || this.state.answer !== '') {
      return;                                                                   //如果之前没输入数字，或者已经输过一次小数点，或者上次输入的是运算符，或者之前有计算结果，直接返回
    } else this.setState({
      formula: this.state.formula + e.target.value,
      hasdot: true,
      newnumber: false,
    })
  }

  handleOperator(e) {
    if(this.state.formula === '' || this.state.answer === 'MaxLimit') {         //如果之前没输入数字，或者计算结果超限，直接返回
      return;
    }
    if(this.state.answer !== '') {                                              //如果之前有计算结果，且没超限制，代入之前的结果并初始化                                           
      this.setState({
        formula: this.state.answer + e.target.value,
        answer: '',
        hasdot: false,
        naughtyzero: false,
        newnumber: true,
      })
      return;
    }
    if(this.state.formula.search(/\W$/) === this.state.formula.length-1) {      //如果上次输入的是运算符或小数点                                                          
      this.setState({                                                           //替换上次的运算符并相应置位
        formula: this.state.formula.replace(/\W$/, e.target.value),
        hasdot: false,
        naughtyzero: false,
        newnumber: true,
      });
      return;
    }
    this.setState({
      formula: this.state.formula + e.target.value,
      hasdot: false,
      naughtyzero: false,
      newnumber: true,
    });
  }

  

  handeleCal() {                                                                //遇到了一个问题，设置state后没有及时更新，下一步使用state仍报错。
    let formula = this.state.formula;
    if(formula.search(/\W$/) > 0) {
      formula = formula.slice(0, formula.length-1)
    }
    let answer = Math.round(10000000000000000 * eval(formula)) / 10000000000000000;
    if(answer > 100000000000 || answer < -100000000000) {
      answer = 'MaxLimit';
    }
    this.setState({answer: answer})
  }  

  render() {
    return (
      <div className="calculator">
        <Formula text={this.state.formula} />
        <Output text={this.state.answer} />
        <Buttons 
          clickNumber={this.handleNumber.bind(this)}
          clickZero={this.handleZero.bind(this)}
          clickOperator={this.handleOperator.bind(this)}
          clickDecimal={this.handleDecimal.bind(this)}
          clickEqual={this.handeleCal.bind(this)}
          clickClear={this.handleClear}
        />
      </div>
    )
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div>
        <button id='clear' onClick={this.props.clickClear} className="jumbo">AC</button>
        <button id='divide' value='/' onClick={this.props.clickOperator}>/</button>
        <button id='multiply' value='*' onClick={this.props.clickOperator}>*</button>
        <button id='seven' value='7' onClick={this.props.clickNumber}>7</button>
        <button id='eight' value='8' onClick={this.props.clickNumber}>8</button>
        <button id='nine' value='9' onClick={this.props.clickNumber}>9</button>
        <button id='subtract' value='-' onClick={this.props.clickOperator}>-</button>
        <button id='four' value='4' onClick={this.props.clickNumber}>4</button>
        <button id='five' value='5' onClick={this.props.clickNumber}>5</button>
        <button id='six' value='6' onClick={this.props.clickNumber}>6</button>
        <button id='add' value='+' onClick={this.props.clickOperator}>+</button>
        <button id='one' value='1' onClick={this.props.clickNumber}>1</button>
        <button id='two' value='2' onClick={this.props.clickNumber}>2</button>
        <button id='three' value='3' onClick={this.props.clickNumber}>3</button>
        <button id='zero' value='0' onClick={this.props.clickZero}>0</button>
        <button id='decimal' value='.' onClick={this.props.clickDecimal}>.</button>
        <button id='equals' onClick={this.props.clickEqual}>=</button>
      </div>
    )
  }
}

class Output extends React.Component {
  render() {
    return (
      <div id="display" className="outputScreen">
        {this.props.text}
      </div>
    )
  }
}

class Formula extends React.Component {
  render() {
    return <div className="formulaScreen">{this.props.text}</div>
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));