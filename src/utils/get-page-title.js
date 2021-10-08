import defaultSettings from '@/settings'

const title = defaultSettings.title || '销售进程管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
