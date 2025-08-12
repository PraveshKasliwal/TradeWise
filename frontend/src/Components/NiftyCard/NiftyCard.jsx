import '../../index.css';

const NiftyCard = () => {
    return (
        <div className="niftyCard">
            <div>
                <div>{stock.name}</div>
                <div>{stock.price}</div>
            </div>
            <div>
                <div>{stock.change}</div>
                <div>{stock.changePercent}</div>
            </div>
        </div>
    )
}

export default NiftyCard