package com.erp.dto;

import java.util.Map;

public class AttendanceSummaryDto {
	   private long present;
	    private long absent;
	    private long leave;
	    private long notMarked;

       public AttendanceSummaryDto() {}

       public AttendanceSummaryDto(long present, long absent, long leave, long notMarked) {
           this.present = present;
           this.absent = absent;
           this.leave = leave;
           this.notMarked = notMarked;
       }

       public long getPresent() { return present; }
       public void setPresent(long present) { this.present = present; }
       public long getAbsent() { return absent; }
       public void setAbsent(long absent) { this.absent = absent; }
       public long getLeave() { return leave; }
       public void setLeave(long leave) { this.leave = leave; }
       public long getNotMarked() { return notMarked; }
       public void setNotMarked(long notMarked) { this.notMarked = notMarked; }
}
