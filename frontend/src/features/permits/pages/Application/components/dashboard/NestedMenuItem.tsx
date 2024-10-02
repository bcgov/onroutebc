import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItemfrom '@mui/material/MenuItem';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { HTMLAttributes, RefAttributes, useImperativeHandle, useRef, useState } from 'react';

// Define the props type
type NestedMenuItemProps = {
  parentMenuOpen: boolean;
  label: string;
  rightIcon?: React.ReactNode; // Optional, with default value
  keepOpen?: boolean;
  children?: React.ReactNode;
  customTheme?: string;
  className?: string;
  tabIndexProp?: number;
  ContainerPropsProp?: HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>; // Type of container props
  rightAnchored?: boolean;
}

const NestedMenuItem = React.forwardRef<HTMLLIElement, NestedMenuItemProps>(
  ({ 
    parentMenuOpen,
    label,
    rightIcon = <ArrowRight style={{ fontSize: 16 }} />,
    keepOpen,
    children,
    customTheme,
    className,
    tabIndexProp,
    ContainerPropsProp = {},
    rightAnchored,
    ...MenuItemProps }, ref) => {

    const { ref: containerRefProp, ...ContainerProps } =
        ContainerPropsProp;

    const menuItemRef = useRef<HTMLLIElement>(null);
    

    useImperativeHandle(ref, () => menuItemRef.current as HTMLLIElement);

    const containerRef = useRef(null);
    useImperativeHandle(
        containerRefProp,
        () => containerRef.current
    );

    const menuContainerRef = useRef(null);

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const handleMouseEnter = (event) => {
        setIsSubMenuOpen(true);

        if (ContainerProps?.onMouseEnter) {
            ContainerProps.onMouseEnter(event);
        }
    };

    const handleMouseLeave = (event) => {
        setIsSubMenuOpen(false);

        if (ContainerProps?.onMouseLeave) {
            ContainerProps.onMouseLeave(event);
        }
    };

    const isSubmenuFocused = () => {
        const active = containerRef.current?.ownerDocument?.activeElement;

        for (const child of menuContainerRef.current?.children ?? []) {
            if (child === active) {
                return true;
            }
        }
        return false;
    };

    const handleFocus = (event) => {
        if (event.target === containerRef.current) {
            setIsSubMenuOpen(true);
        }

        if (ContainerProps?.onFocus) {
            ContainerProps.onFocus(event);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            return;
        }

        if (isSubmenuFocused()) {
            event.stopPropagation();
        }

        const active = containerRef.current?.ownerDocument?.activeElement;

        if (event.key === 'ArrowLeft' && isSubmenuFocused()) {
            containerRef.current?.focus();
        }

        if (
            event.key === 'ArrowRight' &&
            event.target === containerRef.current &&
            event.target === active
        ) {
            const firstChild = menuContainerRef.current?.children[0];
            firstChild?.focus();
        }
    };

    const open = isSubMenuOpen && parentMenuOpen;

    let tabIndex;
    if (!props.disabled) {
        tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
    }

    return (
        <div
            {...ContainerProps}
            ref={containerRef}
            onFocus={handleFocus}
            tabIndex={tabIndex}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
        >
            <MenuItem
                {...MenuItemProps}
                data-open={!!open || undefined}
                className={className}
                ref={menuItemRef}
                keepOpen={keepOpen}
            >
                {label}
                <div style={{ flexGrow: 1 }} />
                {rightIcon}
            </MenuItem>
            <Menu
                hideBackdrop
                style={{ pointerEvents: 'none' }}
                anchorEl={menuItemRef.current}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: rightAnchored ? 'left' : 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: rightAnchored ? 'right' : 'left',
                }}
                css={customTheme}
                open={!!open}
                autoFocus={false}
                disableAutoFocus
                disableEnforceFocus
                onClose={() => {
                    setIsSubMenuOpen(false);
                }}
            >
                <div ref={menuContainerRef} style={{ pointerEvents: 'auto' }}>
                    {children}
                </div>
            </Menu>
        </div>
    );
});

export default NestedMenuItem;