import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { useOverrides } from '@quarkly/components';
import { Box, Button } from '@quarkly/widgets';
import GalleryItem from './GalleryItem';
import GalleryLightbox from './GalleryLightbox';
const windowHeightVisible = 1.5;
const defaultPreviewImageSrc = 'https://via.placeholder.com/500';
const defaultFullImageSrc = 'https://via.placeholder.com/1200';
const overrides = {
	'Wrapper': {
		kind: 'Box'
	},
	'Item': {
		kind: 'GalleryItem',
		props: {
			'cursor': 'pointer'
		}
	},
	'Lightbox': {
		kind: 'GalleryLightbox',
		props: {
			'height': 0,
			'min-height': 0
		}
	},
	'Button More': {
		kind: 'Button',
		props: {
			'margin': '20px auto 0',
			'display': 'block'
		}
	},
	'Button More :Visible': {
		kind: 'Button',
		props: {
			'display': 'block'
		}
	},
	'Button More :Hidden': {
		kind: 'Button',
		props: {
			'display': 'none'
		}
	}
};

const loadImage = url => new Promise(resolve => {
	const img = document.createElement('img');
	img.addEventListener('load', () => resolve(img));
	img.src = url;
});

const changeStrInNumber = str => {
	const reg = /^[\d.,]+$/;
	const newStr = str.replace(/\s/g, '');
	if (reg.test(newStr)) return `${parseInt(newStr)}px`;
	return `${newStr}`;
};

const getAPI = () => {
	if (typeof window !== "undefined") return window.QAPI || {};
	if (typeof global !== "undefined") return global.QAPI || {};
	return {};
};

const Gallery = ({
	galleryItemNumbProp,
	columnsCountProp,
	aspectRatioProp,
	loaderFormatProp,
	autoFillInProp,
	imagesMaxWidthProp,
	imagesMinWidthProp,
	borderWidthProp,
	offScrollProp,
	hideLoaderPreviewImage,
	hideLoaderFullImage,
	...props
}) => {
	const galleryRef = useRef(null);
	const picturesParamsRef = useRef([]);
	const lastRan = useRef(Date.now());
	const scrollLoadCountRef = useRef(1);
	const clickLoadCountRef = useRef(1);
	const [isOpen, setOpen] = useState(false);
	const [isZoom, setZoom] = useState(false);
	const [isBigImage, setBigImage] = useState(false);
	const [imageClicked, setImageClicked] = useState(false);
	const [galleryItemWidth, setGalleryItemWidth] = useState(null);
	const [itemsLoadingNumb, setItemsLoadingNumb] = useState(galleryItemNumbProp);
	const [isButtonVisible, setButtonVisible] = useState(loaderFormatProp === 'Click');
	const [someImageFullParams, setSomeImageFullParams] = useState({});
	const addImageParams = useCallback((index, data) => {
		picturesParamsRef.current[index] = {
			'src': data.srcFull,
			'srcset': data.srcSetFull,
			'sizes': data.sizesFull,
			'alt': data.altFull,
			'title': data.titleFull,
			'objectFit': data.objectFitFull,
			'objectPosition': data.objectPositionFull,
			'loading': data.loadingFull
		};
	}, [picturesParamsRef.current]);
	const throttledEffect = useCallback((callback, delay) => {
		lastRan.current = Date.now();
		const handler = setTimeout(function () {
			if (Date.now() - lastRan.current >= delay) {
				callback();
				lastRan.current = Date.now();
			}
		}, delay - (Date.now() - lastRan.current));
		return () => clearTimeout(handler);
	}, []);
	const getItemSize = useCallback(galleryWidth => (galleryWidth - (columnsCountProp - 1) * borderWidthProp) / columnsCountProp, [columnsCountProp, borderWidthProp, columnsCountProp]);
	const handleResize = useCallback(el => {
		throttledEffect(() => {
			const galleryWidth = el[0].contentRect.width;
			const imageWidth = getItemSize(galleryWidth);
			setGalleryItemWidth(imageWidth);
		}, 100);
	}, [columnsCountProp, borderWidthProp, columnsCountProp]);
	useEffect(() => {
		const resizer = new ResizeObserver(handleResize);
		resizer.observe(galleryRef.current);
		return () => {
			resizer.unobserve(galleryRef.current);
		};
	}, [galleryRef.current]);
	const galleryItemCountNumb = useMemo(() => {
		return parseInt(galleryItemNumbProp);
	}, [galleryItemNumbProp]);
	const getItemNumbOnView = useCallback(galleryWidth => {
		const visibleSpace = window.innerHeight * windowHeightVisible;
		const visibleRows = Math.ceil(visibleSpace / getItemSize(galleryWidth));
		const items = visibleRows * columnsCountProp;
		if (items > galleryItemCountNumb) return galleryItemCountNumb;
		return items;
	}, [galleryItemNumbProp, columnsCountProp, borderWidthProp, loaderFormatProp, aspectRatioProp, autoFillInProp, imagesMaxWidthProp, imagesMinWidthProp]);
	const loadMore = useCallback(type => {
		const gallerySizes = galleryRef.current.getBoundingClientRect();
		const items = getItemNumbOnView(gallerySizes.width);
		let newItems;
		if (type === 'scroll') newItems = items + items * scrollLoadCountRef.current;
		if (type === 'click') newItems = items + items * clickLoadCountRef.current;

		if (newItems < galleryItemNumbProp) {
			setItemsLoadingNumb(newItems);
			if (type === 'scroll') scrollLoadCountRef.current = scrollLoadCountRef.current + 1;
			if (type === 'click') clickLoadCountRef.current = clickLoadCountRef.current + 1;
		} else {
			setItemsLoadingNumb(galleryItemCountNumb);
			setButtonVisible(false);
		}
	}, [galleryItemNumbProp]);
	const loadOnClick = useCallback(() => {
		const gallerySizes = galleryRef.current.getBoundingClientRect();

		if (gallerySizes.bottom - window.innerHeight / 2 < window.innerHeight) {
			loadMore('click');
		}
	}, [galleryRef.current]);
	const loadOnScroll = useCallback(() => {
		const gallerySizes = galleryRef.current.getBoundingClientRect();
		const items = getItemNumbOnView(gallerySizes.width);
		const newItems = items + items * scrollLoadCountRef.current;

		if (gallerySizes.bottom - window.innerHeight / 2 < window.innerHeight) {
			loadMore('scroll');

			if (newItems > galleryItemCountNumb) {
				window.removeEventListener('scroll', loadOnScroll);
				window.removeEventListener('resize', loadOnScroll);
				window.removeEventListener('orientationchange', loadOnScroll);
			}
		}
	}, [galleryRef.current, scrollLoadCountRef.current]); // const loadOnScroll = () => {
	// 	const gallerySizes = galleryRef.current.getBoundingClientRect();
	// 	const items = getItemNumbOnView(gallerySizes.width);
	// 	const newItems = items + items * scrollLoadCountRef.current;
	// 	if (gallerySizes.bottom - (window.innerHeight / 2) < window.innerHeight) {
	// 		loadMore('scroll');
	// 		if(newItems > galleryItemCountNumb) {
	// 			window.removeEventListener('scroll', loadOnScroll);
	// 			window.removeEventListener('resize', loadOnScroll);
	// 			window.removeEventListener('orientationchange', loadOnScroll);
	// 		}
	// 	}
	// };

	useEffect(() => {
		const gallerySizes = galleryRef.current.getBoundingClientRect();
		const items = getItemNumbOnView(gallerySizes.width);
		const {
			mode
		} = getAPI();

		if (mode === 'development') {
			if (loaderFormatProp === 'All' || loaderFormatProp === 'Scroll') {
				setItemsLoadingNumb(galleryItemCountNumb);
				setButtonVisible(false);
			} else if (loaderFormatProp === 'Click') {
				setItemsLoadingNumb(items);
				setButtonVisible(items !== galleryItemCountNumb);
			}
		} else if (mode === 'production') {
			if (loaderFormatProp === 'All') {
				setItemsLoadingNumb(galleryItemCountNumb);
				setButtonVisible(false);
			} else if (loaderFormatProp === 'Scroll') {
				window.addEventListener('scroll', loadOnScroll);
				window.addEventListener('resize', loadOnScroll);
				window.addEventListener('orientationchange', loadOnScroll);
				setButtonVisible(false);
				setItemsLoadingNumb(items);
			} else if (loaderFormatProp === 'Click') {
				setItemsLoadingNumb(items);
				setButtonVisible(items !== galleryItemCountNumb);
			}

			;
		}

		;
		return () => {
			window.removeEventListener('scroll', loadOnScroll);
			window.removeEventListener('resize', loadOnScroll);
			window.removeEventListener('orientationchange', loadOnScroll);
		};
	}, [galleryItemNumbProp, columnsCountProp, borderWidthProp, loaderFormatProp, aspectRatioProp, autoFillInProp, imagesMaxWidthProp, imagesMinWidthProp]);
	const {
		override,
		rest
	} = useOverrides(props, overrides);
	const items = Array(itemsLoadingNumb < 0 ? 0 : itemsLoadingNumb).fill().map(index => <GalleryItem
		{...override(`Item`, `Item ${index}`)}
		key={`${rest['data-qid']}-item-${index}`}
		index={index}
		loadImage={loadImage}
		addImageParams={addImageParams}
		setOpen={setOpen}
		galleryItemWidth={galleryItemWidth}
		setSomeImageFullParams={setSomeImageFullParams}
		setImageClicked={setImageClicked}
		aspectRatioProp={aspectRatioProp}
		imagesMinWidthProp={imagesMinWidthProp}
		imagesMaxWidthProp={imagesMaxWidthProp}
		autoFillInProp={autoFillInProp}
		columnsCountProp={columnsCountProp}
		borderWidthProp={borderWidthProp}
		hideLoaderPreviewImage={hideLoaderPreviewImage}
		defaultPreviewImageSrc={defaultPreviewImageSrc}
		defaultFullImageSrc={defaultFullImageSrc}
	/>);
	return <Box {...rest}>
		<Box
			ref={galleryRef}
			display='grid'
			grid-gap={`${changeStrInNumber(borderWidthProp)}`}
			grid-auto-flow={autoFillInProp ? 'dense' : 'row'}
			grid-template-columns={`repeat(${columnsCountProp},
          minmax(${changeStrInNumber(imagesMinWidthProp)},
          ${changeStrInNumber(imagesMaxWidthProp)}))`}
		>
			{items}
		</Box>
		<Button onClick={loadOnClick} {...override(`Button More`, `Button More ${isButtonVisible ? ':Visible' : ':Hidden'}`)}>
			Загрузить еще 
      
		</Button>
		<GalleryLightbox
			{...override(`Lightbox`)}
			loadImage={loadImage}
			someImageFullParams={someImageFullParams}
			setSomeImageFullParams={setSomeImageFullParams}
			isOpen={isOpen}
			setOpen={setOpen}
			isBigImage={isBigImage}
			setBigImage={setBigImage}
			isZoom={isZoom}
			setZoom={setZoom}
			offScrollProp={offScrollProp}
			imageClicked={imageClicked}
			setImageClicked={setImageClicked}
			defaultFullImageSrc={defaultFullImageSrc}
			hideLoaderFullImage={hideLoaderFullImage}
		/>
	</Box>;
};

const propInfo = {
	galleryItemNumbProp: {
		title: 'Количество изображений',
		description: {
			en: 'Количество изображений галереи'
		},
		control: 'input',
		category: 'Gallery',
		weight: 1
	},
	columnsCountProp: {
		title: 'Количество столбцов',
		description: {
			en: 'Укажите количество столбцов для изображений'
		},
		control: 'input',
		category: 'Gallery',
		weight: 1
	},
	borderWidthProp: {
		title: 'Ширина отступов',
		description: {
			en: 'Укажите ширину отступов'
		},
		control: 'input',
		category: 'Gallery',
		weight: 1
	},
	autoFillInProp: {
		title: 'Атоматиечски заполнять свободные места',
		description: {
			en: 'Если есть свободное пространство, заполнить его изображением'
		},
		control: 'checkbox',
		category: 'Gallery',
		weight: 1
	},
	loaderFormatProp: {
		title: 'Варианты загрузки изображений',
		description: {
			en: 'Как загружать изображения?'
		},
		control: 'radio-group',
		variants: [{
			title: {
				en: 'Все сразу',
				ru: 'Все сразу'
			},
			value: 'All'
		}, {
			title: {
				en: 'При скроле',
				ru: 'При скроле'
			},
			value: 'Scroll'
		}, {
			title: {
				en: 'По кнопке',
				ru: 'По кнопке'
			},
			value: 'Click'
		}],
		category: 'images',
		weight: 1
	},
	aspectRatioProp: {
		title: 'Соотношение сторон',
		description: {
			en: 'Выберите соотношение сторон изображений'
		},
		control: 'select',
		variants: ['auto', '16:9', '4:3', '3:2', '1:1', '2:3', '3:4', '9:16'],
		category: 'images',
		weight: 1
	},
	imagesMaxWidthProp: {
		title: 'Максимальная ширина изображений',
		description: {
			en: 'Укажите максимальную ширину изображений'
		},
		control: 'input',
		category: 'images',
		weight: 1
	},
	imagesMinWidthProp: {
		title: 'Минимальная ширина изображений',
		description: {
			en: 'Укажите минимальную ширину изображений'
		},
		control: 'input',
		category: 'images',
		weight: 1
	},
	hideLoaderPreviewImage: {
		title: 'Отключить лоадер для превью',
		description: {
			en: 'Отключить лоадер для превью изображений'
		},
		control: 'checkbox',
		category: 'images',
		weight: 1
	},
	offScrollProp: {
		title: 'Отключить скролл',
		description: {
			ru: 'Отключить скролл при показе полного изображения'
		},
		control: 'checkbox',
		category: 'Lightbox',
		weight: 1
	},
	hideLoaderFullImage: {
		title: 'Отключить лоадер для полной картинки',
		description: {
			en: 'Отключить лоадер для полной картинки'
		},
		control: 'checkbox',
		category: 'Lightbox',
		weight: 1
	}
};
const defaultProps = {
	galleryItemNumbProp: 8,
	columnsCountProp: 4,
	aspectRatioProp: 'auto',
	loaderFormatProp: 'All',
	autoFillInProp: true,
	imagesAutoResizeProp: false,
	hideLoaderPreviewImage: false,
	hideLoaderFullImage: false,
	imagesMinWidthProp: '80',
	imagesMaxWidthProp: '1fr',
	borderWidthProp: '10',
	offScrollProp: true
};
Object.assign(Gallery, {
	overrides,
	propInfo,
	defaultProps
});
export default Gallery;