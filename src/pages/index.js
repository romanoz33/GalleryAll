import React from "react";
import theme from "theme";
import { Theme, Link } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { Override } from "@quarkly/components";
import * as Components from "components";
export default (() => {
	return <Theme theme={theme}>
		<GlobalQuarklyPageStyles pageUrl={"index"} />
		<Helmet>
			<title>
				Quarkly export
			</title>
			<meta name={"description"} content={"Web site created using quarkly.io"} />
			<link rel={"shortcut icon"} href={"https://uploads.quarkly.io/readme/cra/favicon-32x32.ico"} type={"image/x-icon"} />
		</Helmet>
		<Components.Gallery>
			<Override slot="Item 1" srcFull="https://images.unsplash.com/photo-1617623345634-f9a870bc30e4?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&h=2000" srcPreview="https://images.unsplash.com/photo-1617649858889-8f33ed07bc5e?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000" titleFull="fsddddddddddddddddd" />
			<Override slot="Item 0" srcFull="https://images.unsplash.com/photo-1617658946816-d35c3adc3835?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&h=2000" srcPreview="https://images.unsplash.com/photo-1617467191821-f7f65e876501?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&h=2000" />
			<Override
				slot="Item 2"
				srcPreview="https://images.unsplash.com/photo-1617679139957-a2a988781f25?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000"
				srcFull="https://images.unsplash.com/photo-1617678151201-2596079f0b30?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&h=2000"
				titleFull="titletitletitletitletitletitle"
				altFull="AltAltAltAltAltAltAltAlt"
			/>
			<Override slot="Item 3" srcFull="https://images.unsplash.com/photo-1617678578939-43db129bff94?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&h=2000" srcPreview="https://images.unsplash.com/photo-1617649002577-8777da6c7969?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000" />
			<Override slot="Item" />
		</Components.Gallery>
		<Link
			font={"--capture"}
			font-size={"10px"}
			position={"fixed"}
			bottom={"12px"}
			right={"12px"}
			z-index={"4"}
			border-radius={"4px"}
			padding={"5px 12px 4px"}
			background-color={"--dark"}
			opacity={"0.6"}
			hover-opacity={"1"}
			color={"--light"}
			cursor={"pointer"}
			transition={"--opacityOut"}
			quarkly-title={"Badge"}
			text-decoration-line={"initial"}
			href={"https://quarkly.io/"}
			target={"_blank"}
		>
			Made on Quarkly
		</Link>
	</Theme>;
});