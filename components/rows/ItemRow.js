import Link from 'next/link'
import Row from './Row'
import ArrayValue from '../data/ArrayValue'
import FeatureValue from '../data/FeatureValue'

export default function ItemRow({
  item,
  columns = [],
  add = null,
  remove = null,
  move = null,
}) {
  let columnYes = [],
    columnNo = [],
    columnArray = []
  columns.forEach((c) => {
    if (c.type === 'bool') {
      if (item.data[c._id] === true) {
        columnYes.push(c)
      } else if (item.data[c._id] === false) {
        columnNo.push(c)
      }
    } else if (c.type === 'array' && (item.data[c._id] || []).length > 0) {
      columnArray.push(c)
    }
  })

  return (
    <Row
      type={'item'}
      content={item}
      add={add}
      remove={remove}
      move={move}
      bodyContent={
        <>
          {columnYes.length > 0 ? (
            <div className={'d-flex flex-wrap mb-1'}>
              {columnYes.map((c) => (
                <FeatureValue
                  data={true}
                  column={c}
                  sponsor={item.sponsor}
                  key={c._id}
                />
              ))}
            </div>
          ) : (
            <></>
          )}
          {!item.sponsor && columnNo.length > 0 ? (
            <div className={'d-flex flex-wrap mb-1'}>
              {columnNo.map((c) => (
                <FeatureValue data={false} column={c} key={c._id} />
              ))}
            </div>
          ) : (
            <></>
          )}
          {columnArray.length > 0 ? (
            <div className={'d-flex flex-wrap mb-1'}>
              {columnArray.map((c) => {
                return (
                  <div key={c._id}>
                    <Link href={'/column/' + c.urlId} key={c._id}>
                      <a className={'me-2'} data-tip={'View column ' + c.name}>
                        {c.name}:
                      </a>
                    </Link>
                    <ArrayValue data={item.data[c._id]} column={c} />
                  </div>
                )
              })}
            </div>
          ) : (
            <></>
          )}
        </>
      }
    />
  )
}
