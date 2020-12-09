import CMS from 'netlify-cms-app'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import AboutPagePreview from './preview-templates/AboutPagePreview'
import BlogPostPreview from './preview-templates/BlogPostPreview'
import MixPreview from './preview-templates/MixPreview'
import RadioArchivePreview from './preview-templates/RadioArchivePreview'
import ProductPagePreview from './preview-templates/ProductPagePreview'

CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('about', AboutPagePreview)
CMS.registerPreviewTemplate('products', ProductPagePreview)
CMS.registerPreviewTemplate('radio-archive', RadioArchivePreview)
CMS.registerPreviewTemplate('mix', MixPreview)
CMS.registerPreviewTemplate('blog', BlogPostPreview)
