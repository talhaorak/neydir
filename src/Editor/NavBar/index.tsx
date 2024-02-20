import { Nav, NavDropdown } from "react-bootstrap";

export interface INavBarProps {
    onMenuItemClick: (menu: string, item: string) => void;
}

export default function NavBar(p: INavBarProps) {
    const handleMenuItemClick = (eventKey: string | null) => {
        const [menu, item] = eventKey!.split('-');
        p.onMenuItemClick(menu, item);
    };

    return (
        <Nav variant="pills" activeKey="1" onSelect={handleMenuItemClick}>
            <NavDropdown title="File" id="nav-dropdown-file">
                <NavDropdown.Item eventKey="file-new">New</NavDropdown.Item>
                <NavDropdown.Item eventKey="file-save">Save</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Edit" id="nav-dropdown-edit">
                <NavDropdown.Item eventKey="edit-undo">Undo</NavDropdown.Item>
                <NavDropdown.Item eventKey="edit-redo">Redo</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="View" id="nav-dropdown-view">
                <NavDropdown.Item eventKey="view-fullscreen">Fullscreen</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Help" id="nav-dropdown-help">
                <NavDropdown.Item eventKey="help-about">About</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    )
}
