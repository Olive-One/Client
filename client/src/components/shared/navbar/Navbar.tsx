"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import type { NavbarRoute } from '@/types/navbar.types';
import NavbarMenuItem from './NavbarMenuItem';

interface NavbarProps {
	routes: NavbarRoute[];
	className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ routes, className, ...rest }) => {
	return (
		<div 
			className={cn(
				"h-full flex flex-col",
				className
			)} 
			{...rest}
		>
			{/* Sidebar header */}
			{/* <div className="p-4 border-b border-border">
				<h2 className="text-lg font-semibold text-foreground">Navigation</h2>
			</div>
			 */}
			{/* Sidebar menu items */}
			<div className="flex-1 overflow-y-auto p-4 space-y-2">
				{routes.map((route) => (
					<NavbarMenuItem key={route.path} route={route} />
				))}
			</div>
		</div>
	);
};

export default Navbar;