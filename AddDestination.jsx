import React, { Component } from "react";

export default class AddDestination extends Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    static defaultProps = {
        onAdd: () => null
    }

    getInitialState = () => ({
        id: '',
        description: '',
        city: '',
        state: '',
        zip: ''
    });

    handleChange = (field, event) => {
        const { target: { value } } = event;

        this.setState({
            [field]: value
        });
    }

    handleAdd = () => {
        const { id, description, city, state, zip } = this.state;

        this.setState(this.getInitialState(), () => {
            this.props.onAdd({ id, description, city, state, zip });
        });

        alert('Destination Added!');
    }

    handleCancel = () => {
        this.setState(this.getInitialState());
    }

    

      
    render() {
        
        return (

            
            <div className="ui container raised very padded segment">
                
                <div className="ui small form">
                    <div className="required field required eight wide">
                            <label htmlFor="description">Description</label>
                            <input type="text" id="description" value={this.state.description} onChange={this.handleChange.bind(this, 'description')} />
                    </div>
                    <div class="fields">
                        <div className="required field required eight ">
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" value={this.state.city} onChange={this.handleChange.bind(this, 'city')} />
                        </div>
                        <div className="required field required eight ">
                                <label htmlFor="state">State</label>
                                <input type="text" id="state" value={this.state.state} onChange={this.handleChange.bind(this, 'state')} />
                        </div>
                        <div className="required field required eight ">
                                <label htmlFor="zip">Zip</label>
                                <input type="text" id="zip" value={this.state.zip} onChange={this.handleChange.bind(this, 'zip')} />
                        </div>
                    </div>
                    <button className="ui positive button" onClick={this.handleAdd}>
                        Save
                    </button>
                </div>       
            </div>
        );
    }
}