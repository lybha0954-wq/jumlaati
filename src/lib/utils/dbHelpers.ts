/**
 *  * فحص ما إذا كان الخطأ ناتجاً عن خلل في المخطط (Missing table, column, function)
  */
  export function isSchemaError(error: any): boolean {
    if (!error) return false;

      // فحص رموز أخطاء PostgreSQL
        if (error.code && typeof error.code === 'string') {
            const cls = error.code.substring(0, 2);
                // 42: Syntax Error / Undefined Table or Column
                    // 08: Connection Exception
                        if (cls === '42' || cls === '08') return true;
                            // 23: Integrity Constraint Violation (not a schema structure error)
                                if (cls === '23') return false;
                                  }

                                    // فحص نص الرسالة للأخطاء الشائعة
                                      const errorMessage = error?.message || error?.details || error?.hint || '';
                                        if (errorMessage) {
                                            return /relation.*does not exist|column.*does not exist|function.*does not exist|syntax error/i.test(
                                                  String(errorMessage)
                                                      );
                                                        }

                                                          return false;
                                                          }

                                                          /**
                                                           * تحويل آمن للأرقام يضمن عدم إرجاع NaN
                                                            */
                                                            export const safeNumber = (value: unknown, fallback = 0): number => {
                                                              if (value === null || value === undefined || value === '') return fallback;
                                                                const parsed = Number(value);
                                                                  return Number.isNaN(parsed) ? fallback : parsed;
                                                                  };

                                                                  /**
                                                                   * تحويل آمن للنصوص
                                                                    */
                                                                    export const safeString = (value: unknown, fallback = ''): string => {
                                                                      if (value === null || value === undefined) return fallback;
                                                                        return String(value);
                                                                        };

                                                                        /**
                                                                         * تحويل آمن للقيم المنطقية
                                                                          */
                                                                          export const safeBoolean = (value: unknown, fallback = false): boolean => {
                                                                            if (typeof value === 'boolean') return value;
                                                                              if (value === null || value === undefined) return fallback;
                                                                                return Boolean(value);
                                                                                };
                                                                                
 */