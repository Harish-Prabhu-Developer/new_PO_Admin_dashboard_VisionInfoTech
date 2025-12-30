import React from 'react'
import { Home, ChevronRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Reusable Dynamic Breadcrumbs Component
 * 
 * @param {Array} items - Array of breadcrumb items with shape:
 *   { id, label, href, onClick }
 * @param {Function} onItemClick - Optional callback when breadcrumb is clicked
 * @param {Boolean} showHome - Show home icon at start (default: true)
 * @param {String} homeHref - Home link href (default: '/dashboard')
 * @param {String} className - Additional CSS classes
 * @param {String} separatorColor - Separator icon color (default: 'text-slate-300')
 * @param {String} linkColor - Link text color (default: 'text-gray-500')
 * @param {String} activeLinkColor - Active/last link color (default: 'text-indigo-500')
 * 
 * @example
 * <Breadcrumbs 
 *   items={[
 *     { id: 1, label: 'Dashboard', href: '/dashboard' },
 *     { id: 2, label: 'PO List', href: '/example' },
 *     { id: 3, label: 'PO-3517' }
 *   ]}
 *   onItemClick={(item) => console.log(item)}
 * />
 */
const Breadcrumbs = ({
  items = [],
  onItemClick,
  showHome = true,
  homeHref = '/dashboard',
  className = '',
  separatorColor = 'text-slate-300',
  linkColor = 'text-gray-500',
  activeLinkColor = 'text-indigo-500',
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Handle home icon click
  const handleHomeClick = () => {
    if (onItemClick) {
      onItemClick({ id: 'home', label: 'Home', href: homeHref })
    }
    navigate(homeHref)
  }

  // Handle breadcrumb item click
  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item)
    }
    if (item.href && item.href !== '#') {
      navigate(item.href)
    }
    if (item.onClick) {
      item.onClick(item)
    }
  }

  // Determine if item is the last one
  const isLastItem = (index) => index === items.length - 1

  return (
    <div
      className={`flex flex-wrap items-center space-x-2 text-sm font-medium ${className}`}
      role="navigation"
      aria-label="Breadcrumb"
    >
      {/* Home Icon */}
      {showHome && (
        <>
          <button
            type="button"
            aria-label="Home"
            onClick={handleHomeClick}
            className={`p-1 rounded-lg hover:bg-slate-100 transition ${linkColor} hover:text-slate-700`}
            title="Go to home"
          >
            <Home size={20} className="text-slate-600" />
          </button>
          {items.length > 0 && (
            <ChevronRight size={18} className={separatorColor} />
          )}
        </>
      )}

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <React.Fragment key={item.id || index}>
          <button
            type="button"
            onClick={() => handleItemClick(item)}
            disabled={isLastItem(index)}
            className={`px-2 py-1 rounded-lg transition ${
              isLastItem(index)
                ? `${activeLinkColor} cursor-default font-semibold`
                : `${linkColor} hover:text-slate-700 hover:bg-slate-100 cursor-pointer`
            }`}
            title={item.label}
            aria-current={isLastItem(index) ? 'page' : undefined}
          >
            {item.label}
          </button>

          {/* Separator (except for last item) */}
          {!isLastItem(index) && (
            <ChevronRight size={18} className={separatorColor} />
          )}
        </React.Fragment>
      ))}

      {/* Empty State */}
      {items.length === 0 && !showHome && (
        <span className="text-gray-400">No breadcrumbs</span>
      )}
    </div>
  )
}

export default Breadcrumbs