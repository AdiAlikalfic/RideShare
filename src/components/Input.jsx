import "./Input.css";

function Input(props) {
    return(
        <input 
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        className="input"
        />
    )
}

export default Input;