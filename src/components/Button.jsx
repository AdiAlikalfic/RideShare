import "./Button.css"

function Button({children, onClick, variant, disabled, type="button"}) {
    return (
    <button type={type} onClick={onClick} disabled={disabled} className={`btn btn-${variant}`}>{children}</button>
)
}

export default Button