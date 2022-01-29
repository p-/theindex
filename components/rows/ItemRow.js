import Link from 'next/link'
import Row from './Row'
import ArrayValue from '../data/ArrayValue'
import FeatureValue from '../data/FeatureValue'
import { splitColumnsIntoTypes } from '../../lib/item'
import ProAndConValue from '../data/ProAndConValue'
import { Types } from '../../types/Components'
import { ColumnType } from '../../types/Column'
import LanguageValue from '../data/LanguageValue'

export default function ItemRow({
  item,
  columns = [],
  add = null,
  remove = null,
  move = null,
}) {
  const column = splitColumnsIntoTypes(columns, item.data)

  return (
    <Row
      type={Types.item}
      content={item}
      add={add}
      remove={remove}
      move={move}
      bodyContent={
        <>
          {column.pro.length > 0 && (
            <div className={'d-flex flex-wrap mb-1'}>
              {column.pro.map((c) => (
                <ProAndConValue
                  data={true}
                  column={c}
                  sponsor={item.sponsor}
                  key={c._id}
                />
              ))}
            </div>
          )}
          {column.features.length > 0 && (
            <div className={'d-flex flex-wrap mb-1'}>
              {column.features.map((c) => (
                <FeatureValue
                  column={c}
                  sponsor={item.sponsor}
                  key={c._id}
                  data={null}
                />
              ))}
            </div>
          )}
          {column.array.length > 0 && (
            <div className={'d-flex flex-wrap mb-1'}>
              {column.array.map((c) => {
                return (
                  <div key={c._id}>
                    <Link href={'/column/' + c.urlId}>
                      <a className={'me-2'} data-tip={'View column ' + c.name}>
                        {c.name}:
                      </a>
                    </Link>
                    {c.type === ColumnType.array ? (
                      <ArrayValue data={item.data[c._id]} column={c} />
                    ) : (
                      <LanguageValue data={item.data[c._id]} column={c} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      }
    />
  )
}
