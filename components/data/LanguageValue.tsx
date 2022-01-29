import Link from 'next/link'
import DataBadge from './DataBadge'
import { Column, ColumnType } from '../../types/Column'
import { FC, useEffect, useState } from 'react'
import { getLanguages } from '../../lib/utils'
import Input from './Input'
import Button from '../buttons/Button'
import ReactTooltip from 'react-tooltip'

type Props = {
  data: string[]
  column: Column
  onChange?: (values: string[]) => void
}

const LanguageValue: FC<Props> = ({ data, column, onChange = null }) => {
  const [filter, setFilter] = useState('')
  const [expand, setExpand] = useState(false)
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [filter, expand])

  if (column.type !== ColumnType.language) {
    console.error('Called LanguageValue but column type is', column.type)
    return
  }

  if (onChange === null) {
    return (
      <>
        {data.map((v) => (
          <Link href={'/column/' + column.urlId + '?v=' + v} key={v}>
            <a className={'me-2'} data-tip={column.name + ' language: ' + v}>
              <DataBadge name={v} />
            </a>
          </Link>
        ))}
      </>
    )
  }

  const filtered = getLanguages().filter((lang) =>
    lang.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  )
  const sliced = expand
    ? filtered
    : filtered.slice(0, Math.min(16, filtered.length))

  return (
    <>
      <Input
        value={filter}
        hover={'Search language...'}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className={'mt-2'}>
        {sliced.map((lang) => {
          return (
            <a
              data-tip={'Language: ' + lang.name}
              className={'me-2'}
              key={lang.iso6393}
              onClick={() => {
                if (data.includes(lang.iso6393)) {
                  onChange(data.filter((d) => d !== lang.iso6393))
                } else {
                  onChange(data.concat([lang.iso6393]))
                }
              }}
            >
              <DataBadge
                data={data.includes(lang.iso6393) ? true : null}
                name={lang.name}
              />
            </a>
          )
        })}
        {sliced.length < filtered.length && <DataBadge name={'...'} />}
      </div>
      {filtered.length > 16 && (
        <div className={'mt-2'}>
          <Button
            onClick={() => setExpand(!expand)}
            hover={expand ? 'Hide languages' : 'Show all languages'}
          >
            {expand ? 'show less' : 'show all'}
          </Button>
        </div>
      )}
    </>
  )
}

export default LanguageValue
