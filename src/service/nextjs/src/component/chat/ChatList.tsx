import React, { useEffect, useRef } from 'react';
import style from '@/style/friend/list/index.module.css';
import { Button, Stack } from '@mui/material';
import UserBriefInformation from '@/component/common/user/bried-information';
import NickMenu from '@/component/chat/NickMenu';

interface StatusProps {
	status?: '방장' | '관리자';
}
const ChatStatus = ({ status }: StatusProps) => {
	const spanRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (spanRef.current) {
			spanRef.current.style.color =
				status === '방장' ? '#1CB119' : status === '관리자' ? '#495D49' : '#9C27B0';
		}
	}, [status]);

	return (
		<div className={style.container}>
			<span ref={spanRef}>{status}</span>
		</div>
	);
};

const ChattingListPage = () => {
	const datas = [
		{ profileImageSrc: null, nickName: '닉네임', condition: '방장' },
		{ profileImageSrc: null, nickName: '닉네임2', condition: '관리자' },
		{ profileImageSrc: null, nickName: '닉네임3', condition: '일반' },
		{ profileImageSrc: null, nickName: '닉네임4', condition: '일반' },
	];

	return (
		<Stack justifyContent={'space-between'} height={'100%'}>
			<div className={style.container}>
				<div>참여 목록</div>
				<div>
					{datas?.map((data, index) => (
						<UserBriefInformation
							key={index}
							profileImageSrc={data?.profileImageSrc}
							nickName={<NickMenu nick={data?.nickName} />}
							condition={<ChatStatus status={data?.condition as '방장' | '관리자' | undefined} />}
							className={style['user-brief-information']}
						/>
					))}
				</div>
			</div>
			<Button sx={{ marginBottom: 4 }}>채널 설정</Button>
		</Stack>
	);
};

export default ChattingListPage;