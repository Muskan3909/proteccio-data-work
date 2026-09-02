import { SocketEvents } from '@/shared/socket-events';
import { useSocket } from '@/socket/socketContext';
import { ITaskViewModel } from '@/types/tasks/task.types';
import logger from '@/utils/errorLogger';
import { Switch, Button, Flex } from '@/shared/antd-imports';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TaskDrawerBillableProps {
interface TaskDrawerBillableProps {
