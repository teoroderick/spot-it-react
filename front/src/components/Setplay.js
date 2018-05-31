import React from 'react';

class Setplay extends React.Component{
    constructor () {
        super();

        this.state = {
            nameInput : ""
        }
    }

    render(){
        return(
            <form onSubmit={ this.handleFormSubmitUp }>
                <div className="input-group">
                    <span className="input-group-btn">
                        <button className="btn btn-primary" 
                                type="submit"
                                disabled={ this.state.nameInput === "" }>
                                Add
                        </button>
                    </span>
                    <input  className="form-control" 
                            placeholder="add a todo" 
                            value={this.state.nameInput}
                            onChange={this.handleOnChangeLocal} 
                            name='nameInput'
                    />
                </div>
            </form>
        );
    }
}

export default Setplay;