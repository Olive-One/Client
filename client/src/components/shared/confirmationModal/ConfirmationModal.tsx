import React, { type ReactNode } from 'react';
import CustomModal from '../customModal/CustomModal';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    header: string;
    subHeader: string;
    children: ReactNode;
    showCloseButton?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    header, 
    subHeader, 
    children, 
    showCloseButton = true 
}) => {
    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title={header}
            size="xl"
            lineHeight="2.2rem"
            showCloseButton={showCloseButton}
        >
            <div className="flex flex-col items-start space-y-4">
                <p className="text-lg leading-7">
                    {subHeader}
                </p>
                <div className="flex flex-col gap-6 w-full justify-center mt-10">
                    {children}
                </div>
            </div>
        </CustomModal>
    );
};

export default ConfirmationModal;