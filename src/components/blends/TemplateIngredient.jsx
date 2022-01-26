import cn from 'classnames'
import React from 'react'
import PreviewImage from '../droppreview/PreviewImage'

/**
 * @typedef {import('../../api/fetch').Template} Template
 */

/**
 * @typedef {Object} TemplateIngredientProps
 * @property {Template} template
 * @property {boolean} [selected]
 * @property {(template: Template) => void} onRemove
 */

/** @type {React.FC<TemplateIngredientProps>} */
export const TemplateIngredient = ({ template, selected = false, onRemove }) => (
    <div
        className={cn(
            'relative w-full mx-auto rounded-md overflow-hidden',
            'flex flex-col',
            'text-base break-words',
            'backdrop-filter backdrop-blur-sm border',
            'transition-all',
            { 'border-primary bg-primary bg-opacity-40': selected },
            { 'bg-paper': !selected },
        )}
        onClick={() => onRemove(template)}
    >
        <div className={cn('')}>
            <div className={cn('w-full')}>
                <PreviewImage data={template} />
            </div>
            <div>{template.name}</div>
            <div>Template: {template.template_id}</div>
        </div>
    </div>
)

export default TemplateIngredient
