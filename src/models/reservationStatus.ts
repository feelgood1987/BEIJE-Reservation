 export enum ReservationStatus {
    /**
     * Waiting for the reservation time
     */
    QUEUED = 'QUEUED',
    
    /**
     * Reservation time passed successfully
     */
    SUCCESSFUL = 'SUCCESSFUL',

    /**
     * Reservation cancelled by user
     */
    CANCELLED = 'CANCELLED',

    /**
     * Reservation rejected by admin
     */
    REJECTED = 'REJECTED'
}