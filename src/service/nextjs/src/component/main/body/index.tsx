'use client';

import { useCallback, useState } from 'react';
import style from '../../../style/main/body/index.module.css';
import ChattingRoom from './chatting-room';
import ChattingModeToggle from './chatting-mode';
import { Box, Button, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import CustomSnackbar from '@/component/profile/modifyProfile/customSnackbar';
import Chatroom from '@/type/chatroom.type';
import { Channel, ChannelVisibility } from '@/type/channel.type';
import useFetchData from '@/hook/useFetchData';
import { AxiosError } from 'axios';
import CustomModal from '@/component/common/CustomModal';
import ChannelSetting from '@/component/common/ChannelSetting';

export type ChattingMode = 'normal' | 'private';

const MainPageBody = () => {
	const [mode, setMode] = useState<ChattingMode>('normal');
	const router = useRouter();
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [message, setMessage] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState<string>('');

	/** channel api*/
	const {
		data: chatDatas,
		isLoading: isChatLoading,
		error: chatError,
	} = useFetchData<Channel[]>('/channel');

	/** chatroom api **/
	const {
		data: dmDatas,
		isLoading: isDmLoading,
		error: dmError,
	} = useFetchData<Chatroom[]>('/chatroom');

	const navigateChannel = useCallback(
		async (channelId: string, password?: string) => {
			// if (password)
			// password 검증 필요
			try {
				await router.push(`/chat/${channelId}/common`);
			} catch (e) {
				setMessage('채널 입장에 실패했습니다.');
				setShowSnackbar(true);
			}
		},
		[router],
	);

	const getView = (
		isLoading: boolean,
		datas: Channel[] | Chatroom[] | undefined | null,
		error: AxiosError | null | undefined,
	) => {
		if (isLoading) return <Skeleton />;
		if (!datas || error) return <div>데이터를 불러오지 못했습니다.</div>;
		if (datas?.length === 0) return <div>데이터가 없습니다.</div>;

		return datas?.map(data => (
			<Box
				key={data.id}
				onClick={() =>
					mode === 'normal'
						? (data as Channel)?.visibility === 'PROTECTED'
							? setOpen(true)
							: navigateChannel(data?.id, password)
						: router.push(`/chat/${data?.id}/private`)
				}
				style={{ textDecoration: 'none' }}
			>
				{/*채널이 protected일때만 비밀번호 변경 보임*/}
				{open && (
					<CustomModal setIsOpened={setOpen}>
						<Stack spacing={2}>
							<Typography>비밀번호를 입력해주세요. (6자리 숫자)</Typography>
							<TextField size="small" />
							<Stack flexDirection={'row'} gap={1}>
								<Button variant={'contained'} onClick={() => navigateChannel(data.id)}>
									입장
								</Button>
								<Button variant={'contained'} onClick={() => setOpen(false)}>
									취소
								</Button>
							</Stack>
						</Stack>
					</CustomModal>
				)}
				<ChattingRoom
					title={mode === 'normal' ? (data as Channel)?.title : 'DM방입니다.'}
					visibility={
						mode === 'normal'
							? ((data as Channel)?.visibility as 'PUBLIC' | 'PROTECTED')
							: 'PRIVATE'
					}
				/>
			</Box>
		));
	};

	return (
		<div className={style.container}>
			<div>
				<CustomSnackbar
					open={showSnackbar}
					onClose={() => setShowSnackbar(false)}
					message={message}
					success={false}
				/>
				<ChattingModeToggle mode={mode} setMode={setMode} />
				<div style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
					{mode === 'normal'
						? getView(isChatLoading, chatDatas, chatError)
						: getView(isDmLoading, dmDatas, dmError)}
				</div>
			</div>
		</div>
	);
};

export default MainPageBody;
