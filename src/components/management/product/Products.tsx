import { store } from '../../../main/store'

export default function Products() {
    const variables = store(state => state.variables)
    return (
        <>
            {variables.Product.map(x => {
                return (
                    <div key={String(x.variableName)}>
                        <h2>{x.variableName}</h2>
                        <h2>{x.values.sku}</h2>
                        <h2>{x.values.orderable}</h2>
                        <h2>{x.values.consumable}</h2>
                        <h2>{x.values.producable}</h2>
                    </div>
                )
            })}
        </>
    )
}
