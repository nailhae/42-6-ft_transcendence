'use client';

import style from '../../../style/chat/create/index.module.css';
import CreateChatVisibility from '@/component/chat/create/visibility';
import CreateChatTitle from '@/component/chat/create/title';
import CreateChatPassword from '@/component/chat/create/password';
import { useState } from 'react';
import { BottomButton } from '@/component/common/ButtomButton';
import { Header } from '@/component/common/Header';
import { Stack } from '@mui/material';

export type Visibility = 'public' | 'protected' | 'private';

const ChatCreatePage = () => {
	const [visibility, setVisibility] = useState<Visibility>('public');
	const [title, setTitle] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	return (
		<div>
			<div className={style.container}>
				<Header title={'채널 생성'} />
				<Stack gap={4}>
					<CreateChatVisibility visibility={visibility} setVisibility={setVisibility} />
					<CreateChatTitle title={title} setTitle={setTitle} />
					<CreateChatPassword password={password} setPassword={setPassword} />
				</Stack>
				<BottomButton
					title={'생성하기'}
					onClick={() => {
						alert(JSON.stringify({ visibility, title, password }));
					}}
				/>
			</div>
		</div>
	);
};

export default ChatCreatePage;