export type FootprintKey = "files" | "pkg_json_keys"; // | "packages";

export type LinkliProductUrls =
	| {
			docs: string;
			dashboard?: string;
			status?: string;
	  }
	| string;

export type LinkliProductFootprint = {
	files: string[];
	pkg_json_keys: string[];
	//   packages?: string[];
};

export type LinkliProduct = {
	name: string;
	urls: LinkliProductUrls;
	footprint: LinkliProductFootprint;
	companions?: string[];
};

export type LinkliCollectionProduct = Pick<LinkliProduct, "name" | "urls">;

export interface LinkliCollection {
	created_at: string;
	products: LinkliCollectionProduct[];
	custom?: LinkliCollectionProduct[];
}
