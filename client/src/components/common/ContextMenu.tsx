import { Button } from "antd";
import { MouseEventHandler } from "react";
import useContextMenu from "../../hooks/UseContextMenu"

type ContextMenuProps = {
    text: string | undefined
    onClick: (text: string) => void
}

export function ContextMenu({ text, onClick }: ContextMenuProps) {

    const { anchorPoint, show } = useContextMenu();

    const handleClick = (e: any) => {
        if (text) {
            onClick(text);
        }
    }

    if (show && text) {
        return (
            <ul
                className="menu"
                style={{
                    top: anchorPoint.y,
                    left: anchorPoint.x
                }}
            >
                {text && <li>{text}</li>}
                <hr></hr>
                <li><Button onClick={(e) => handleClick(e)}>Kulcsszónak jelöl</Button></li>
            </ul>
        )
    }
    return <></>;
}