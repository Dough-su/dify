'use client'
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useStickyScroll, { ScrollPosition } from '../use-sticky-scroll'
import Item from './item'
import type { Plugin } from '@/app/components/plugins/types.ts'
import cn from '@/utils/classnames'
import { marketplaceUrlPrefix } from '@/config'
// import { RiArrowRightUpLine } from '@remixicon/react'

type Props = {
  wrapElemRef: React.RefObject<HTMLElement>
  list: Plugin[]
  searchText: string
  tags: string[]
  toolContentClassName?: string
  disableMaxWidth?: boolean
}

const List = (
  {
    ref,
    wrapElemRef,
    searchText,
    tags,
    list,
    toolContentClassName,
    disableMaxWidth = false,
  },
) => {
  const { t } = useTranslation()
  const hasFilter = !searchText
  const hasRes = list.length > 0
  const urlWithSearchText = `${marketplaceUrlPrefix}/?q=${searchText}&tags=${tags.join(',')}`
  const nextToStickyELemRef = useRef<HTMLDivElement>(null)

  const { handleScroll, scrollPosition } = useStickyScroll({
    wrapElemRef,
    nextToStickyELemRef,
  })
  const stickyClassName = useMemo(() => {
    switch (scrollPosition) {
      case ScrollPosition.aboveTheWrap:
        return 'top-0 h-9 pt-3 pb-2 shadow-xs bg-components-panel-bg-blur cursor-pointer'
      case ScrollPosition.showing:
        return 'bottom-0 pt-3 pb-1'
      case ScrollPosition.belowTheWrap:
        return 'bottom-0 items-center rounded-b-xl border-t border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-lg rounded-b-lg cursor-pointer'
    }
  }, [scrollPosition])

  useImperativeHandle(ref, () => ({
    handleScroll,
  }))

  useEffect(() => {
    handleScroll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list])

  const handleHeadClick = () => {
    if (scrollPosition === ScrollPosition.belowTheWrap) {
      nextToStickyELemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.open(urlWithSearchText, '_blank')
  }

  const maxWidthClassName = toolContentClassName || 'max-w-[300px]'

  return (
    <>
      {hasRes && (
        <div
          className={cn('system-sm-medium sticky z-10 flex h-8 cursor-pointer justify-between px-4 py-1 text-text-primary', stickyClassName, !disableMaxWidth && maxWidthClassName)}
          onClick={handleHeadClick}
        >
          <span>{t('plugin.fromMarketplace')}</span>
        </div>
      )}
      <div className={cn('p-1', !disableMaxWidth && maxWidthClassName)} ref={nextToStickyELemRef}>
        {list.map((item, index) => (
          <Item
            key={index}
            payload={item}
            onAction={() => { }}
          />
        ))}
      </div>
    </>
  )
}

List.displayName = 'List'

export default List
