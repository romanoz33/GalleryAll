import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useOverrides } from '@quarkly/components';
import { Box, Image } from '@quarkly/widgets';
import GalleryLoader from './GalleryLoader';
const overrides = {
	'Loader': {
		'kind': 'Icon'
	}
};

const GalleryItem = ({
	columsCountProp,
	rowsCountProp,
	imagesAutoResizeProp,
	showImageProp,
	srcPreview,
	srcSetPreview,
	sizesPreview,
	altPreview,
	titlePreview,
	objectFitPreview,
	objectPositionPreview,
	loadingPreview,
	srcFull,
	srcSetFull,
	sizesFull,
	altFull,
	titleFull,
	objectFitFull,
	objectPositionFull,
	loadingFull,
	index,
	loadImage,
	addPictureParams,
	setOpen,
	galleryItemWidth,
	ratioSizes,
	setRatioSizes,
	setSomePictureParams,
	setClicked,
	ratioFormatsProp,
	imagesMinWidthProp,
	imagesMaxWidthProp,
	autoFillInProp,
	columnsCountProp,
	borderWidthProp,
	previewLoaderStatusProp,
	defaultPreviewSrc,
	defaultFullSrc,
	...props
}) => {
	const {
		override,
		rest
	} = useOverrides(props, overrides);
	const [isLoading, setLoading] = useState(true);
	const boxRef = useRef();
	addPictureParams(index, {
		srcFull,
		srcSetFull,
		sizesFull,
		altFull,
		titleFull,
		objectFitFull,
		objectPositionFull,
		loadingFull
	});
	useEffect(() => {
		setOpen(showImageProp);
	}, [showImageProp]);
	useEffect(() => {
		loadImage(srcPreview || defaultPreviewSrc).then(img => {
			setLoading(false);
		});
	}, []);
	const openGalleryItem = useCallback(() => {
		setSomePictureParams({
			'src': srcFull || defaultFullSrc,
			'srcset': srcSetFull,
			'sizes': sizesFull,
			'alt': altFull,
			'title': titleFull,
			'object-position': objectFitFull,
			'object-fit': objectPositionFull,
			'loading': loadingFull
		});
		setClicked(true);
	});
	const changeFormat = useCallback((format, sizes) => {
		const params = {
			width: galleryItemWidth,
			height: sizes.height
		};

		switch (format) {
			case '16:9':
				params.height = 9 * params.width / 16;
				break;

			case '4:3':
				params.height = 3 * params.width / 4;
				break;

			case '3:2':
				params.height = 2 * params.width / 3;
				break;

			case '1:1':
				params.height = params.width;
				break;

			case '2:3':
				params.height = 3 * params.width / 2;
				break;

			case '3:4':
				params.height = 4 * params.width / 3;
				break;

			case '9:16':
				params.height = 16 * params.width / 9;
				break;

			default:
				params.height = 'auto';
				params.width = 'auto';
		}

		setRatioSizes(params);
	}, [ratioFormatsProp, columnsCountProp, borderWidthProp, imagesMinWidthProp, imagesMaxWidthProp, autoFillInProp, galleryItemWidth]);
	useEffect(() => {
		const sizes = boxRef.current.getBoundingClientRect();
		changeFormat(ratioFormatsProp, sizes);
	}, [ratioFormatsProp, columnsCountProp, borderWidthProp, imagesMinWidthProp, imagesMaxWidthProp, autoFillInProp, galleryItemWidth]);
	return <Box
		ref={boxRef}
		{...rest}
		min-width='auto'
		min-height='auto'
		grid-column={`span ${columsCountProp}`}
		grid-row={`span ${rowsCountProp}`}
		position='relative'
		height='auto'
	>
		 
		<Image
			onClick={openGalleryItem}
			max-width='100%'
			max-height='100%'
			min-width={imagesAutoResizeProp ? '100%' : 'auto'}
			min-height={imagesAutoResizeProp ? '100%' : 'auto'}
			object-fit={imagesAutoResizeProp ? 'cover' : objectFitPreview}
			srcset={srcSetPreview}
			sizes={sizesPreview}
			title={titlePreview}
			object-position={objectPositionPreview}
			alt={altPreview}
			loading={loadingPreview}
			opacity={isLoading ? '0' : '1'}
			src={isLoading ? '' : srcPreview || defaultPreviewSrc}
			{...ratioSizes}
		/>
		  
		{previewLoaderStatusProp ? '' : <GalleryLoader {...override('Loader')} isLoading={isLoading} />}
	</Box>;
};

const propInfo = {
	columsCountProp: {
		title: 'Ширина в столбцах',
		description: {
			en: 'Количество столбцов, которое должно занимать изображение'
		},
		control: 'input',
		category: 'Main',
		weight: 1
	},
	rowsCountProp: {
		title: 'Высота в колонках',
		description: {
			en: 'Количество колонок, которое должно занимать изображение'
		},
		control: 'input',
		category: 'Main',
		weight: 1
	},
	imagesAutoResizeProp: {
		title: 'Растянуть на всю ширину и высоту',
		description: {
			en: 'Растягивать изображения на всю ширину и высоту, если есть свободное пространство'
		},
		control: 'checkbox',
		category: 'images',
		weight: 1
	},
	showImageProp: {
		title: 'Показать изображение',
		description: {
			ru: 'Показать полное изображение'
		},
		control: 'checkbox',
		category: 'images',
		weight: 1
	},
	srcPreview: {
		weight: 1,
		control: "image",
		category: "Image preview",
		title: "Src",
		description: {
			en: "src — image address",
			ru: "src — aдрес изображения"
		}
	},
	srcSetPreview: {
		title: "Srcset",
		weight: 1,
		type: "string",
		control: "srcSet",
		multiply: true,
		category: "Image preview",
		description: {
			en: "srcSet — a string which identifies one or more image sources with descriptors",
			ru: "srcSet — строка, определяющая один или несколько источников изображений с дескрипторами"
		}
	},
	sizesPreview: {
		title: "Sizes",
		weight: 1,
		type: "string",
		control: "sizes",
		multiply: true,
		category: "Image preview",
		description: {
			en: "sizes — image slot sizes from srcSet for different breakpoints",
			ru: "sizes — размеры контейнера изображения из srcSet для различных брейкпоинтов"
		}
	},
	altPreview: {
		title: "Alt",
		weight: 1,
		type: "string",
		category: "Image preview",
		description: {
			en: "alt – a piece of text that appears when an image cannot be displayed",
			ru: "alt — текст, который будет отображаться когда изображение недоступно"
		}
	},
	titlePreview: {
		title: "Title",
		weight: 1,
		type: "string",
		category: "Image preview",
		description: {
			en: "title – additional information for the element that appears as a tooltip",
			ru: "title — описывает содержимое элемента в виде всплывающей подсказки"
		}
	},
	objectFitPreview: {
		title: "Object fit",
		weight: 1,
		type: "string",
		control: "select",
		variants: ["fill", "contain", "cover", "none", "scale-down"],
		category: "Image preview",
		description: {
			en: "object-fit – defines how the content of the replaced element should be resized to fit its container",
			ru: "object-fit — определяет, как содержимое заменяемого элемента должно заполнять контейнер"
		}
	},
	objectPositionPreview: {
		title: "Object position",
		weight: 1,
		type: "string",
		category: "Image preview",
		description: {
			en: "object-position – specifies the alignment of the selected replaced element contents within the element box relative to the X and Y coordinate axes",
			ru: "object-position — задаёт положение содержимого замещаемого элемента внутри контейнера относительно координатных осей X и Y"
		}
	},
	loadingPreview: {
		title: "Loading",
		weight: 1,
		type: "string",
		category: "Image preview",
		control: "select",
		variants: ["eager", "lazy"],
		description: {
			en: "loading - indicates how the browser should load the image",
			ru: "loading — указывает как браузер должен загружать изображение"
		}
	},
	srcFull: {
		weight: 1,
		control: "image",
		category: "Image Full",
		title: "Src",
		description: {
			en: "src — image address",
			ru: "src — aдрес изображения"
		}
	},
	srcSetFull: {
		title: "Srcset",
		weight: 1,
		type: "string",
		control: "srcSet",
		multiply: true,
		category: "Image Full",
		description: {
			en: "srcSet — a string which identifies one or more image sources with descriptors",
			ru: "srcSet — строка, определяющая один или несколько источников изображений с дескрипторами"
		}
	},
	sizesFull: {
		title: "Sizes",
		weight: 1,
		type: "string",
		control: "sizes",
		multiply: true,
		category: "Image Full",
		description: {
			en: "sizes — image slot sizes from srcSet for different breakpoints",
			ru: "sizes — размеры контейнера изображения из srcSet для различных брейкпоинтов"
		}
	},
	altFull: {
		title: "Alt",
		weight: 1,
		type: "string",
		category: "Image Full",
		description: {
			en: "alt – a piece of text that appears when an image cannot be displayed",
			ru: "alt — текст, который будет отображаться когда изображение недоступно"
		}
	},
	titleFull: {
		title: "Title",
		weight: 1,
		type: "string",
		category: "Image Full",
		description: {
			en: "title – additional information for the element that appears as a tooltip",
			ru: "title — описывает содержимое элемента в виде всплывающей подсказки"
		}
	},
	objectFitFull: {
		title: "Object fit",
		weight: 1,
		type: "string",
		control: "select",
		variants: ["fill", "contain", "cover", "none", "scale-down"],
		category: "Image Full",
		description: {
			en: "object-fit – defines how the content of the replaced element should be resized to fit its container",
			ru: "object-fit — определяет, как содержимое заменяемого элемента должно заполнять контейнер"
		}
	},
	objectPositionFull: {
		title: "Object position",
		weight: 1,
		type: "string",
		category: "Image Full",
		description: {
			en: "object-position – specifies the alignment of the selected replaced element contents within the element box relative to the X and Y coordinate axes",
			ru: "object-position — задаёт положение содержимого замещаемого элемента внутри контейнера относительно координатных осей X и Y"
		}
	},
	loadingFull: {
		title: "Loading",
		weight: 1,
		type: "string",
		category: "Image Full",
		control: "select",
		variants: ["eager", "lazy"],
		description: {
			en: "loading - indicates how the browser should load the image",
			ru: "loading — указывает как браузер должен загружать изображение"
		}
	}
};
const defaultProps = {
	columsCountProp: 1,
	rowsCountProp: 1,
	imagesAutoResizeProp: true,
	showImageProp: false
};
Object.assign(GalleryItem, {
	overrides,
	propInfo,
	defaultProps,
	effects: {
		hover: ":hover"
	}
});
export default GalleryItem;