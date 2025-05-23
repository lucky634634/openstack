import './Table.css'

export default function Table({ headers, data }) {
    if (!headers || headers.length === 0) return <span>No header provided</span>
    return <table className='table'>
        <thead>
            <tr>
                <th></th>
                {headers.map((header, index) => {
                    return <th key={index}>{header}</th>
                })}
            </tr>
        </thead>
        <tbody>
            {data.map((row, rowIndex) => {
                return <tr key={rowIndex}>
                    <td><input type="checkbox" /></td>
                    {headers.map((header, columnIndex) => {
                        return <td key={columnIndex}>{row[header]}</td>
                    })}
                </tr>
            })}
        </tbody>
    </table>
}