// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Accessory struct {
	ID          string       `json:"id"`
	Brand       string       `json:"brand"`
	ProductName string       `json:"productName"`
	Subcategory string       `json:"subcategory"`
	Gender      string       `json:"gender"`
	SizePrices  []*SizePrice `json:"sizePrices"`
	Images      []string     `json:"images"`
	InStock     bool         `json:"inStock"`
	ProductLink string       `json:"productLink"`
	SellerName  *string      `json:"sellerName,omitempty"`
	SellerURL   *string      `json:"sellerUrl,omitempty"`
}

type Apparel struct {
	ID          string       `json:"id"`
	Brand       string       `json:"brand"`
	ProductName string       `json:"productName"`
	Subcategory string       `json:"subcategory"`
	Gender      string       `json:"gender"`
	SizePrices  []*SizePrice `json:"sizePrices"`
	Images      []string     `json:"images"`
	InStock     bool         `json:"inStock"`
	ProductLink string       `json:"productLink"`
	SellerName  *string      `json:"sellerName,omitempty"`
	SellerURL   *string      `json:"sellerUrl,omitempty"`
}

type Mutation struct {
}

type Perfume struct {
	ID              string            `json:"id"`
	Brand           string            `json:"brand"`
	Title           string            `json:"title"`
	FragranceFamily string            `json:"fragranceFamily"`
	Concentration   *string           `json:"concentration,omitempty"`
	Subcategory     *string           `json:"subcategory,omitempty"`
	Variants        []*PerfumeVariant `json:"variants,omitempty"`
	Images          []string          `json:"images,omitempty"`
	URL             string            `json:"url"`
	SellerName      *string           `json:"sellerName,omitempty"`
	SellerURL       *string           `json:"sellerUrl,omitempty"`
}

type PerfumeVariant struct {
	Size  *string  `json:"size,omitempty"`
	Price *float64 `json:"price,omitempty"`
}

type Query struct {
}

type SizePrice struct {
	Size  string  `json:"size"`
	Price float64 `json:"price"`
}

type Sneaker struct {
	ID          string       `json:"id"`
	Brand       string       `json:"brand"`
	ProductName string       `json:"productName"`
	SizePrices  []*SizePrice `json:"sizePrices"`
	Images      []string     `json:"images"`
	SoldOut     bool         `json:"soldOut"`
	ProductLink string       `json:"productLink"`
	SellerName  *string      `json:"sellerName,omitempty"`
	SellerURL   *string      `json:"sellerUrl,omitempty"`
}

type Watch struct {
	ID          string   `json:"id"`
	Brand       string   `json:"brand"`
	Name        string   `json:"name"`
	Color       string   `json:"color"`
	SalePrice   float64  `json:"salePrice"`
	MarketPrice string   `json:"marketPrice"`
	Images      []string `json:"images"`
	Link        string   `json:"link"`
	SellerName  *string  `json:"sellerName,omitempty"`
	SellerURL   *string  `json:"sellerUrl,omitempty"`
	Gender      *string  `json:"gender,omitempty"`
}
