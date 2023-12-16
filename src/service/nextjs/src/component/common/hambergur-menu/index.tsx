'use client';

import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import style from '../../../style/common/hambergur-menu/index.module.css';
import CloseIcon from './icon';

interface HambergurMenuProps {
	title: string;
	position: 'left' | 'right';
	setIsOpened: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
}

const HambergurMenu = ({ title, position, setIsOpened, children }: HambergurMenuProps) => {
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (divRef.current) {
			const div = divRef.current as HTMLDivElement;

			div.style.margin = position === 'right' ? '0 0 0 auto' : '0 auto 0 0';
		}
	}, [position]);

	return createPortal(
		<div
			className={style.container}
			onClick={() => {
				setIsOpened(false);
			}}
		>
			<div>
				<div
					onClick={event => {
						event.stopPropagation();
					}}
					ref={divRef}
				>
					<div className={style.header}>
						<span>{title}</span>
						<CloseIcon
							width="calc(30cqh)"
							height="calc(30cqh)"
							onClick={() => {
								setIsOpened(false);
							}}
						/>
					</div>
					<div>{children}</div>
				</div>
			</div>
		</div>,
		document.body,
	);
};

export default HambergurMenu;
