import { Product } from '../types'

const dummyImage = {
	id: 'xyz',
	originalSrc: '/dummy-1.png',
	__typename: 'Image' as 'Image',
}

export const dummyProduct: Product = {
	id: '123',
	handle: 'dummy-product',
	title: 'Dummy Product',
	description: 'Just a dumb thing you can buy!',
	__typename: 'Product',
	images: {
		pageInfo: {
			hasNextPage: false,
			hasPrevPage: false,
		},
		edges: [{ cursor: '1', node: dummyImage }, { cursor: '2', node: dummyImage }],
	},
	variants: {
		pageInfo: {
			hasNextPage: false,
			hasPrevPage: false,
		},
		edges: [
			{
				cursor: '234',
				node: {
					id: 'abc',
					availableForSale: true,
					image: dummyImage,
					price: '100.00',
					title: 'First',
				},
			},
			{
				cursor: '345',
				node: {
					id: 'bcd',
					availableForSale: true,
					image: {
						id: 'xyz',
						originalSrc: '/dummy-2.png',
						__typename: 'Image',
					},
					price: '100.00',
					title: 'Second',
				},
			},
			{
				cursor: '456',
				node: {
					id: 'cde',
					availableForSale: true,
					image: {
						id: 'xyz',
						originalSrc: '/dummy-2.png',
						__typename: 'Image',
					},
					price: '100.00',
					title: 'Third',
				},
			},
		],
	},
}
