import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useOverrides } from '@quarkly/components';
import { Box, Image } from '@quarkly/widgets';
import GalleryLoader from './GalleryLoader';
const overrides = {
	'Loader': {
		kind: 'Icon'
	}
};

const GalleryItem = ({
	columsNumb,
	rowsNumb,
	stretchFull,
	showFullImage,
	previewSrc,
	previewSrcSet,
	previewSizes,
	previewAlt,
	previewTitle,
	previewObjectFit,
	previewObjectPosition,
	previewLoading,
	fullSrc,
	fullSrcSet,
	fullSizes,
	fullAlt,
	fullTitle,
	fullObjectFit,
	fullObjectPosition,
	fullLoading,
	defaultPreviewImageSrc,
	index,
	loadImage,
	addImageParams,
	setOpen,
	galleryItemWidth,
	setSomeImageFullParams,
	setImageClicked,
	ratioFormatsProp,
	imagesMinWidthProp,
	imagesMaxWidthProp,
	autoFillInProp,
	columnsCountProp,
	borderWidthProp,
	previewLoaderStatusProp,
	...props
}) => {
	const boxRef = useRef();
	const [isLoadingPreview, setLoadingPreview] = useState(true);
	const [aspectRatioStyles, setAspectRatioStyles] = useState({
		width: 'auto',
		height: 'auto'
	});
	const correctSrcPreview = useMemo(() => previewSrc || defaultPreviewImageSrc, [previewSrc]);
	useEffect(() => {
		setOpen(showFullImage);
	}, [showFullImage]);
	useEffect(() => {
		loadImage(correctSrcPreview).then(() => setLoadingPreview(false));
	}, []);
	useEffect(() => {
		addImageParams(index, {
			fullSrc,
			fullSrcSet,
			fullSizes,
			fullAlt,
			fullTitle,
			fullObjectFit,
			fullObjectPosition,
			fullLoading
		});
	}, [index]);
	const openGalleryItem = useCallback(() => {
		setSomeImageFullParams({
			'src': fullSrc,
			'srcset': fullSrcSet,
			'sizes': fullSizes,
			'alt': fullAlt,
			'title': fullTitle,
			'object-position': fullObjectFit,
			'object-fit': fullObjectPosition,
			'loading': fullLoading
		});
		setImageClicked(true);
	}, [fullSrc, fullSrcSet, fullSizes, fullAlt, fullTitle, fullObjectFit, fullObjectPosition, fullLoading]);
	const changeAspectRatio = useCallback((ratio, itemSizes) => {
		const params = {
			width: galleryItemWidth,
			height: itemSizes.height
		};

		switch (ratio) {
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

		setAspectRatioStyles(params);
	}, [ratioFormatsProp, columnsCountProp, borderWidthProp, imagesMinWidthProp, imagesMaxWidthProp, autoFillInProp, galleryItemWidth]);
	useEffect(() => {
		const itemSizes = boxRef.current.getBoundingClientRect();
		changeAspectRatio(ratioFormatsProp, itemSizes);
	}, [boxRef.current, ratioFormatsProp, columnsCountProp, borderWidthProp, imagesMinWidthProp, imagesMaxWidthProp, autoFillInProp, galleryItemWidth]);
	const {
		override,
		rest
	} = useOverrides(props, overrides);
	return <Box
		ref={boxRef}
		height='auto'
		position='relative'
		min-width='auto'
		min-height='auto'
		grid-column={`span ${columsNumb}`}
		grid-row={`span ${rowsNumb}`}
		{...rest}
	>
		 
		<Image
			onClick={openGalleryItem}
			max-width='100%'
			max-height='100%'
			min-width={stretchFull ? '100%' : 'auto'}
			min-height={stretchFull ? '100%' : 'auto'}
			object-fit={stretchFull ? 'cover' : previewObjectFit}
			opacity={isLoadingPreview ? '0' : '1'}
			src={!isLoadingPreview && correctSrcPreview}
			srcset={!isLoadingPreview && previewSrcSet}
			title={!isLoadingPreview && previewTitle}
			alt={!isLoadingPreview && previewAlt}
			sizes={!isLoadingPreview && previewSizes}
			object-position={!isLoadingPreview && previewObjectPosition}
			loading={!isLoadingPreview && previewLoading}
			{...aspectRatioStyles}
		/>
		     
		{!previewLoaderStatusProp && <GalleryLoader {...override('Loader')} isLoadingPreview={isLoadingPreview} />}
	</Box>;
};

const propInfo = {
	columsNumb: {
		title: 'Ширина в столбцах',
		description: {
			en: 'Количество столбцов, которое должно занимать изображение'
		},
		control: 'input',
		category: 'Main',
		weight: 1
	},
	rowsNumb: {
		title: 'Высота в колонках',
		description: {
			en: 'Количество колонок, которое должно занимать изображение'
		},
		control: 'input',
		category: 'Main',
		weight: 1
	},
	stretchFull: {
		title: 'Растянуть на всю ширину и высоту',
		description: {
			en: 'Растягивать изображения на всю ширину и высоту, если есть свободное пространство'
		},
		control: 'checkbox',
		category: 'images',
		weight: 1
	},
	showFullImage: {
		title: 'Показать изображение',
		description: {
			ru: 'Показать полное изображение'
		},
		control: 'checkbox',
		category: 'images',
		weight: 1
	},
	previewSrc: {
		weight: 1,
		control: "image",
		category: "Image preview",
		title: "Src",
		description: {
			en: "src — image address",
			ru: "src — aдрес изображения"
		}
	},
	previewSrcSet: {
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
	previewSizes: {
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
	previewAlt: {
		title: "Alt",
		weight: 1,
		type: "string",
		category: "Image preview",
		description: {
			en: "alt – a piece of text that appears when an image cannot be displayed",
			ru: "alt — текст, который будет отображаться когда изображение недоступно"
		}
	},
	previewTitle: {
		title: "Title",
		weight: 1,
		type: "string",
		category: "Image preview",
		description: {
			en: "title – additional information for the element that appears as a tooltip",
			ru: "title — описывает содержимое элемента в виде всплывающей подсказки"
		}
	},
	previewObjectFit: {
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
	previewObjectPosition: {
		title: "Object position",
		weight: 1,
		type: "string",
		category: "Image preview",
		description: {
			en: "object-position – specifies the alignment of the selected replaced element contents within the element box relative to the X and Y coordinate axes",
			ru: "object-position — задаёт положение содержимого замещаемого элемента внутри контейнера относительно координатных осей X и Y"
		}
	},
	previewLoading: {
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
	fullSrc: {
		weight: 1,
		control: "image",
		category: "Image Full",
		title: "Src",
		description: {
			en: "src — image address",
			ru: "src — aдрес изображения"
		}
	},
	fullSrcSet: {
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
	fullSizes: {
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
	fullAlt: {
		title: "Alt",
		weight: 1,
		type: "string",
		category: "Image Full",
		description: {
			en: "alt – a piece of text that appears when an image cannot be displayed",
			ru: "alt — текст, который будет отображаться когда изображение недоступно"
		}
	},
	fullTitle: {
		title: "Title",
		weight: 1,
		type: "string",
		category: "Image Full",
		description: {
			en: "title – additional information for the element that appears as a tooltip",
			ru: "title — описывает содержимое элемента в виде всплывающей подсказки"
		}
	},
	fullObjectFit: {
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
	fullObjectPosition: {
		title: "Object position",
		weight: 1,
		type: "string",
		category: "Image Full",
		description: {
			en: "object-position – specifies the alignment of the selected replaced element contents within the element box relative to the X and Y coordinate axes",
			ru: "object-position — задаёт положение содержимого замещаемого элемента внутри контейнера относительно координатных осей X и Y"
		}
	},
	fullLoading: {
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
	columsNumb: 1,
	rowsNumb: 1,
	stretchFull: true,
	showFullImage: false
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